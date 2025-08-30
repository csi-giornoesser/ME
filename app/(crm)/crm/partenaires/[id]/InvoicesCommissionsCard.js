"use client";
import { useEffect, useState } from "react";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const num = (n) => (n === 0 ? "0" : n != null ? Number(n).toLocaleString("fr-FR") : "—");

export default function InvoicesCommissionsCard({ partnerId, data }) {
  const [state, setState] = useState({ loading: false, error: null, model: null });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    periode: new Date().toISOString().slice(0, 7), // "YYYY-MM"
    echeance_jours: 30
  });
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (data) build(data);
    else if (partnerId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId, data]);

  useEffect(() => {
  if (!partnerId) return;
  const today = new Date();
  if (today.getUTCDate() !== 1) return;

  const prev = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth()-1, 1));
  const period = `${prev.getUTCFullYear()}-${String(prev.getUTCMonth()+1).padStart(2,"0")}`;
  const key = `autoClose:${partnerId}:${period}`;
  if (localStorage.getItem(key)) return; // déjà fait

  fetch("/api/partenaires/close-month", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ period, partnerId })
  })
    .then(() => {
      localStorage.setItem(key, "1");
      return load();
    })
    .catch(() => {/* silencieux */});
}, [partnerId]);


  async function load() {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));
      const r = await fetch(`/api/partenaires/${partnerId}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      build(await r.json());
    } catch (e) {
      console.error(e);
      setState({ loading: false, error: "Impossible de charger les factures", model: null });
    }
  }

  function build(raw) {
    const p = raw.partenaire || {};
    const ca = Array.isArray(raw.ca_par_periode) ? raw.ca_par_periode : [];
    const factures = Array.isArray(raw.factures) ? [...raw.factures] : [];

    const taux = Number(p.taux_commission) || 0;
    const nowMonth = new Date().toISOString().slice(0, 7);
    const caMois = Number(ca.find((x) => x.periode === nowMonth)?.ca) || 0;

    const commissionsMois = Number((caMois * taux / 100).toFixed(2));

    const thisYear = new Date().getFullYear().toString();
    const caAnnuel = ca
      .filter((x) => String(x.periode || "").startsWith(thisYear))
      .reduce((s, x) => s + (Number(x.ca) || 0), 0);
    const commissionsAnnuelles = Number((caAnnuel * taux / 100).toFixed(2));

    const payees = factures.filter((f) => f.statut === "payee");
    const impayees = factures.filter((f) => f.statut !== "payee"); // tout sauf payée
    const montantImpaye = impayees.reduce((s, f) => s + (Number(f.montant) || 0), 0);
    const montantPaye = payees.reduce((s, f) => s + (Number(f.montant) || 0), 0);

    const today = new Date().toISOString().slice(0, 10);
    const enRetard = impayees.filter((f) => f.echeance && f.echeance < today);
    const d30 = new Date();
    d30.setDate(d30.getDate() + 30);
    const prochaines = impayees.filter((f) => f.echeance && f.echeance <= d30.toISOString().slice(0, 10));

    factures.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    setState({
      loading: false,
      error: null,
      model: {
        commissions: { ceMois: commissionsMois, caCeMois: caMois, tauxCommission: taux, periode: nowMonth, commissionsAnnuelles },
        factures: { toutes: factures, impayees, payees, enRetard },
        totaux: { montantImpaye, montantPaye, nombreImpayees: impayees.length, nombrePayees: payees.length },
        alertes: { retard: enRetard.length, prochainesEcheances: prochaines.length },
        coord: p.coordonnees_facturation || {},
        partner: p
      }
    });
  }

  async function previewInvoice() {
  try {
    setGenerating(true);
    setPreview(null);
    const r = await fetch(`/api/partenaires/${partnerId}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "preview", period: form.periode })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.detail || j.error || `HTTP ${r.status}`);

    const p = j.preview || {};
    // normalisation champs
    const normalized = {
      periode: p.periode || p.period || form.periode,
      dossiers_count: p.dossiers_count ?? p.dossiers ?? 0,
      commission_eur: p.commission_eur ?? p.montant ?? 0
    };
    setPreview(normalized);
  } catch (e) {
    alert(`❌ Aperçu impossible: ${e.message}`);
  } finally {
    setGenerating(false);
  }
}


  async function generateInvoice() {
    try {
      setGenerating(true);
      const r = await fetch(`/api/partenaires/${partnerId}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // même contrat que la page qui fonctionne
        body: JSON.stringify({
          action: "create",
          period: form.periode,                 // "YYYY-MM"
          echeance_jours: form.echeance_jours || 30
        })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.detail || j.error || `HTTP ${r.status}`);


      alert("✅ Facture générée avec succès");
      setShowForm(false);
      setForm({ periode: new Date().toISOString().slice(0, 7), echeance_jours: 30 });
      setPreview(j.preview || null);

      // recharger les données
      await load();
    } catch (e) {
      console.error(e);
      alert(`❌ Erreur: ${e.message}`);
    } finally {
      setGenerating(false);
    }
  }

  async function download(f) {
  try {
    if (f.pdf && f.pdf.startsWith("http")) return window.open(f.pdf, "_blank");
    const r = await fetch(`/api/partenaires/${partnerId}/invoices/${f.id}/pdf`);
    if (!r.ok) throw new Error("Document non disponible");
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `facture_${f.id}.pdf` });
    document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); a.remove();
  } catch (e) {
    console.error(e);
    alert("❌ Impossible de télécharger la facture");
  }
}

  // reset l'aperçu quand on change la période
  useEffect(() => { setPreview(null); }, [form.periode]);

  if (state.loading && !state.model) {
    return (
      <section className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold">💰 Facturation & Commissions</h3>
      </section>
    );
  }
  if (state.error) {
    return (
      <section className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">💰 Facturation & Commissions</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="text-red-800">❌ {state.error}</div>
          <button onClick={load} className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">🔄 Réessayer</button>
        </div>
      </section>
    );
  }
  if (!state.model) return null;

  const m = state.model;

  function currentYYYYMM() {
    return new Date().toISOString().slice(0, 7);
  }

  function displayStateLabel(f) {
    if (f?.statut === 'payee') return "Clôturée";
    const nowYM = new Date().toISOString().slice(0, 7);
    return String(f.periode) < nowYM ? "Clôturée" : "Temporaire";
  }

  function stateBadge(f) {
    const label = displayStateLabel(f);
    const map = {
      "Clôturée":  ["bg-green-100 text-green-800", "✅ Clôturée"],
      "Temporaire":["bg-orange-100 text-orange-800", "⏳ Temporaire"],
    };
    const [cls, text] = map[label] || ["bg-gray-100 text-gray-800", `📋 ${label}`];
    return <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${cls}`}>{text}</span>;
  }

  return (
    <section className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">💰 Facturation & Commissions</h3>
        <div className="flex gap-2">
          <button onClick={load} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md">
            🔄 Actualiser
          </button>
          <button onClick={() => setShowForm((s) => !s)} className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            {showForm ? "Annuler" : "+ Générer facture"}
          </button>
        </div>
      </div>

      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/partenaires/close-month", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                period: new Date().toISOString().slice(0,7), // mois courant
                partnerId
              })
            });
            if (!res.ok) {
              const j = await res.json().catch(() => ({}));
              throw new Error(j.details || j.error || `HTTP ${res.status}`);
            }
            await load();
            alert("✅ Facture clôturée avec succès !");
          } catch (e) {
            alert(`❌ Impossible de clôturer la facture : ${e.message}`);
          }
        }}
        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md mb-6"
      >
        🔒 Clôturer ce mois
      </button>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">💸 Commissions à recevoir</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Box title="Ce mois (temporaire)" value={`${num(m.commissions.ceMois)}€`} subtitle={`CA: ${num(m.commissions.caCeMois)}€`} />
            <Box title="Taux commission" value={`${num(m.commissions.tauxCommission)}%`} />
            <Box title="Période" value={m.commissions.periode} subtitle="YYYY-MM" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Montant temporaire — la facture du mois précédent est générée et marquée « payée » automatiquement le 1er du mois.
          </p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">🧾 État facturation</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Box title="En attente" value={`${num(m.totaux.montantImpaye)}€`} subtitle={`${m.totaux.nombreImpayees} facture(s)`} />
          <Box title="Payé" value={`${num(m.totaux.montantPaye)}€`} subtitle={`${m.totaux.nombrePayees} facture(s)`} />
          <Box title="Total factures" value={m.factures.toutes.length} subtitle="Historique" />
        </div>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
          <h4 className="font-medium mb-3">Générer une nouvelle facture</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Période *</span>
              <input
                type="month"
                value={form.periode}
                onChange={(e) => setForm((f) => ({ ...f, periode: e.target.value }))}
                className="border rounded px-3 py-2"
              />
            </label>
            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Échéance (jours)</span>
              <input
                type="number"
                min="1"
                max="90"
                value={form.echeance_jours}
                onChange={(e) => setForm((f) => ({ ...f, echeance_jours: parseInt(e.target.value || "0", 10) }))}
                className="border rounded px-3 py-2"
              />
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={previewInvoice} disabled={generating || !form.periode} className="border px-4 py-2 rounded">
              {generating ? "…" : "👁️ Prévisualiser"}
            </button>
            <button onClick={generateInvoice} disabled={generating || !form.periode} className="bg-green-600 text-white px-4 py-2 rounded">
              {generating ? "⏳ Génération…" : "✅ Générer facture"}
            </button>
            <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded">Annuler</button>
          </div>

          {preview && (
            <div className="mt-4 text-sm text-gray-700">
              <div>Période : <b>{preview.periode}</b></div>
              <div>Dossiers pris en compte : <b>{preview.dossiers_count}</b></div>
              <div>Montant total commissions : <b>{num(preview.commission_eur)}€</b></div>
            </div>
          )}

        </div>
      )}

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">📄 Historique des factures</h4>
        {m.factures.toutes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">—</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">État</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {m.factures.toutes.slice(0, 10).map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">#{f.id}</div>
                      <div className="text-xs text-gray-500">{fmt(f.date)}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">{f.periode || "—"}</td>
                    <td className="px-4 py-4 text-sm font-medium">{num(f.montant)}€</td>
                    <td className="px-4 py-4 text-sm">{stateBadge(f)}</td>
                    <td className="px-4 py-4 text-sm">
                      <div>{fmt(f.echeance)}</div>
                      {f.echeance && new Date(f.echeance) < new Date() && f.statut !== "payee" && (
                        <div className="text-xs text-red-600 font-medium">En retard</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                    <button onClick={() => download(f)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                      📥 PDF
                    </button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {m.factures.toutes.length > 10 && (
              <div className="text-center py-3 text-sm text-gray-500">
                Et {m.factures.toutes.length - 10} autres factures…
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm">
        <h4 className="font-medium mb-2">📮 Coordonnées de facturation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium">{m.coord.societe || m.partner.nom || "—"}</div>
            <div className="text-gray-600">{m.coord.adresse || "—"}</div>
          </div>
          <div>
            <div><strong>Email:</strong> {m.coord.email_facturation || "—"}</div>
            <div><strong>Mode paiement:</strong> {m.partner.paiement?.mode || "—"}</div>
            {m.partner.paiement?.iban && <div><strong>IBAN:</strong> {m.partner.paiement.iban.slice(0, 8)}…</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Box({ title, value, subtitle }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}