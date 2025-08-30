// src/app/partenaires/[id]/page.js
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import PartnerTracking from "./PartnerTracking";

export default function PartenairePage() {
  const { id } = useParams();

  // --- état principal (données partenaire)
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  // --- état facture (nouveau)
  const [period, setPeriod] = useState(() => new Date().toISOString().slice(0, 7)); // "YYYY-MM"
  const [invoicePreview, setInvoicePreview] = useState(null);
  const [invoiceErr, setInvoiceErr] = useState(null);
  const [busy, setBusy] = useState(false);

  // --- chargement fiche partenaire
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const r = await fetch(`/api/partenaires/${id}`, { cache: "no-store" });
        if (!r.ok) {
          const txt = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} ${r.statusText} — ${txt}`);
        }
        const json = await r.json();
        if (!canceled) setData(json);
      } catch (e) {
        console.error(e);
        if (!canceled) setErr(String(e));
      }
    })();
    return () => { canceled = true; };
  }, [id]);

  // --- helpers facture
  async function previewInvoice() {
    setBusy(true); setInvoiceErr(null); setInvoicePreview(null);
    try {
      const r = await fetch(`/api/partenaires/${id}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview", period }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || r.statusText);
      setInvoicePreview(j.preview);
    } catch (e) {
      setInvoiceErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function createInvoice() {
    setBusy(true); setInvoiceErr(null);
    try {
      const r = await fetch(`/api/partenaires/${id}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", period }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || r.statusText);

      // rafraîchir la fiche pour voir la facture ajoutée dans la liste
      const r2 = await fetch(`/api/partenaires/${id}`, { cache: "no-store" });
      const json = await r2.json();
      setData(json);
      setInvoicePreview(j.preview);
    } catch (e) {
      setInvoiceErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  // --- états d'erreur/chargement
  if (err) {
    return (
      <main className="p-6 space-y-2">
        <Link href="/">← Retour</Link>
        <h1 className="text-xl font-bold mt-2">Erreur</h1>
        <pre className="text-sm bg-gray-100 p-3 rounded">{err}</pre>
      </main>
    );
  }
  if (!data) return <main className="p-6">Chargement…</main>;
  if (data.error) {
    return (
      <main className="p-6 space-y-2">
        <Link href="/">← Retour</Link>
        <h1 className="text-xl font-bold mt-2">Partenaire introuvable</h1>
      </main>
    );
  }

  const p = data.partenaire || {};
  const ca = data.ca_par_periode || [];
  const factures = data.factures || [];
  const users = data.partner_users || [];
  const dossiers = data.dossiers || [];
  const exportsHist = data.partner_exports_history || [];
  const docs = p.docs || {};

  return (
    <main className="p-6 space-y-6">
      <Link href="/">← Retour</Link>
      <h1 className="text-2xl font-bold">{p.nom}</h1>
      <p>{p.adresse || "-"}</p>
      <p>
        Référent: {p.referent?.nom || "-"} — {p.referent?.email || "-"} — {p.referent?.telephone || "-"}
      </p>
      <p>
        Intégration: {p.integration || "-"} — Facturation: {p.type_facturation || "-"} — Commission: {p.taux_commission ?? "-"}% — Segment: {p.segment || "-"}
      </p>
      <p>
        Contrat: signé le {p.contrat?.date_signature || "-"} — durée {p.contrat?.duree_mois ?? "-"} mois — statut {p.contrat?.statut || "-"} — {p.contrat?.conditions_commerciales || ""}
      </p>
      <p>
        Paiement: {p.paiement?.mode || "-"} — IBAN {p.paiement?.iban || "-"} — BIC {p.paiement?.bic || "-"}
      </p>
      <p>
        Coord. facturation: {p.coordonnees_facturation?.societe || "-"} — {p.coordonnees_facturation?.email_facturation || "-"} — {p.coordonnees_facturation?.adresse || "-"}
      </p>

      {/* Suivi commercial */}
      <PartnerTracking partnerId={p.id} />

      <section>
        <h3 className="text-lg font-semibold">Utilisateurs (accès partenaire)</h3>
        <ul className="list-disc pl-6">
          {users.length ? users.map(u => (
            <li key={u.id}>
              {u.email} — {u.nom || "-"} — rôle {u.role} — 2FA {u.two_fa_enabled ? "✅" : "❌"} — dernier login {u.last_login_at || "-"}
            </li>
          )) : <li>Aucun utilisateur</li>}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">CA & dossiers (par période)</h3>
        <ul className="list-disc pl-6">
          {ca.length ? ca.map((x, i) => <li key={i}>{x.periode}: {x.ca}€ — dossiers {x.dossiers}</li>) : <li>Aucune donnée</li>}
        </ul>
        <p className="mt-2">CA total: {p.ca_total ?? 0}€ — Commissions: {p.commissions_total ?? 0}€</p>
      </section>

      {/* === Outil Facture (prévisualiser + créer) === */}
      <section className="border rounded p-4 space-y-3">
        <h3 className="text-lg font-semibold">Générer une facture (période)</h3>

        <div className="flex gap-3 items-end">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Période</span>
            <input
              type="month"
              value={period}
              onChange={(e)=>setPeriod(e.target.value)}
              className="border rounded p-2"
            />
          </label>

          <button className="border rounded px-3 py-2" onClick={previewInvoice} disabled={busy}>
            Prévisualiser
          </button>

          <button className="border rounded px-3 py-2" onClick={createInvoice} disabled={busy}>
            Créer la facture
          </button>

          {busy && <span className="text-sm text-gray-500">…</span>}
        </div>

        {invoiceErr && <div className="text-sm text-red-600">{invoiceErr}</div>}

        {invoicePreview && (
          <div className="text-sm text-gray-700">
            <div>Période : <b>{invoicePreview.period}</b></div>
            <div>Dossiers validés : <b>{invoicePreview.dossiers}</b></div>
            <div>Montant total commissions : <b>{invoicePreview.montant}€</b></div>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold">Factures</h3>
        <ul className="list-disc pl-6">
          {factures.length ? factures.map(f => (
            <li key={f.id}>
              {f.id} — {f.montant}€ — {f.statut || "-"} — période {f.periode || "-"} — {f.date} — échéance {f.echeance || "-"} — PDF {f.pdf || "-"}
            </li>
          )) : <li>Aucune facture</li>}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Exports</h3>
        <ul className="list-disc pl-6">
          {exportsHist.length ? exportsHist.map(eh => (
            <li key={eh.id}>
              {eh.generated_at} — {eh.format} — filtres {JSON.stringify(eh.filtres)} — fichier {eh.file || "-"}
            </li>
          )) : <li>Aucun export</li>}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Documentation & contrats</h3>
        <ul className="list-disc pl-6">
          <li>Contrat: {docs.contrat_pdf || "-"}</li>
          <li>Modalités: {docs.modalites_collaboration_pdf || "-"}</li>
          {(docs.documentation_tech || []).map((d, i) => <li key={i}>{d.type} — {d.url}</li>)}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Dossiers du partenaire</h3>
        <ul className="list-disc pl-6">
          {dossiers.length ? dossiers.map(d => (
            <li key={d.id}>
              Dossier #{d.id} — statut {d.statut} — client{" "}
              <Link className="underline" href={`/clients/${d.client_id}`}>#{d.client_id}</Link>{" "}
              — entreprise <Link className="underline" href={`/entreprises/${d.entreprise_id}`}>#{d.entreprise_id}</Link>
              {(d.blocages || []).length ? <> — blocages: {(d.blocages || []).join(", ")}</> : null}
            </li>
          )) : <li>Aucun dossier</li>}
        </ul>
      </section>
    </main>
  );
}
