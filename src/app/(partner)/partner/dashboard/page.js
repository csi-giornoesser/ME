"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// utils
const fmtEur = (n) => (n == null ? "-" : `${Number(n).toFixed(2)}€`);
const parseISO = (d) => (d ? new Date(d) : null);
const sameYM = (d, ref = new Date()) =>
  d && d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
const toCSV = (rows) => {
  if (!rows.length) return "id;date_creation;statut;client_id;entreprise_id;commission\n";
  const headers = Object.keys(rows[0]);
  const esc = (v) => (v == null ? "" : `"${String(v).replaceAll('"','""').replaceAll("\n"," ")}"`);
  return [headers.join(";"), ...rows.map(r => headers.map(h => esc(r[h])).join(";"))].join("\n");
};
const download = (filename, text) => {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export default function PartnerDashboard() {
  const search = useSearchParams();
  const partnerId = Number(search.get("pid") || 1); // TODO: remplacer par l’id de session partenaire

  // state (ordre fixe)
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minCommission, setMinCommission] = useState("");

  // fetch (ordre fixe)
  useEffect(() => {
    let canceled = false;
    (async () => {
      setErr(null);
      try {
        const r = await fetch(`/api/partenaires/${partnerId}`, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        if (!canceled) setData(json);
      } catch (e) {
        if (!canceled) setErr(String(e));
      }
    })();
    return () => { canceled = true; };
  }, [partnerId]);

  // ===== Hooks dérivés TOUJOURS appelés (avec valeurs par défaut) =====
  const partenaire = data?.partenaire ?? null;
  const dossiers   = data?.dossiers ?? [];
  const factures   = data?.factures ?? [];
  const caPeriode  = data?.ca_par_periode ?? [];
  const partnerUsers = data?.partner_users ?? [];
  const exportsHist  = data?.partner_exports_history ?? [];
  const docs = partenaire?.docs ?? {};
  const taux = partenaire?.taux_commission != null ? Number(partenaire.taux_commission) : null;

  const statusesList = useMemo(
    () => Array.from(new Set(dossiers.map(d => d.statut))),
    [dossiers]
  );

  const filtered = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to   = dateTo ? new Date(dateTo) : null;
    if (to) to.setHours(23,59,59,999);
    return dossiers.filter(d => {
      const okS = status === "all" ? true : d.statut === status;
      const dc  = d.date_creation ? new Date(d.date_creation) : null;
      const okFrom = from ? (dc && dc >= from) : true;
      const okTo   = to   ? (dc && dc <= to)   : true;
      const okComm = minCommission !== "" ? (Number(d.commission_partenaire_eur ?? -1) >= Number(minCommission)) : true;
      return okS && okFrom && okTo && okComm;
    });
  }, [dossiers, status, dateFrom, dateTo, minCommission]);

  const kpis = useMemo(() => {
    const counts = {};
    statusesList.forEach(s => (counts[s] = 0));
    filtered.forEach(d => (counts[d.statut] = (counts[d.statut] || 0) + 1));

    const now = new Date();
    const commMonth = dossiers
      .filter(d => sameYM(parseISO(d.date_creation), now))
      .reduce((acc, d) => acc + (Number(d.commission_partenaire_eur) || 0), 0);
    const commTotal = dossiers
      .reduce((acc, d) => acc + (Number(d.commission_partenaire_eur) || 0), 0);

    const caYear = {};
    for (const row of caPeriode) {
      const year = String(row.periode || "").slice(0, 4);
      if (!year) continue;
      caYear[year] = (caYear[year] || 0) + Number(row.ca || 0);
    }
    return { counts, commMonth, commTotal, caYear };
  }, [filtered, dossiers, caPeriode, statusesList]);

  // ===== Renders (après TOUS les hooks) =====
  const isLoading = !data && !err;
  if (err) return <main className="p-6"><h1 className="text-xl font-bold">Erreur</h1><pre>{err}</pre></main>;
  if (isLoading) return <main className="p-6">Chargement…</main>;
  if (!partenaire) return <main className="p-6">Partenaire introuvable</main>;

  const exportCSV = () => {
    const rows = filtered.map(d => ({
      id: d.id,
      date_creation: d.date_creation ?? "",
      statut: d.statut ?? "",
      client_id: d.client_id ?? "",
      entreprise_id: d.entreprise_id ?? "",
      commission: d.commission_partenaire_eur ?? "",
    }));
    download(`dossiers_partner_${partnerId}.csv`, toCSV(rows));
  };

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{partenaire.nom}</h1>
          <p className="text-sm text-gray-600">{partenaire.adresse || ""}</p>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link className="underline" href="/crm/dashboard">CRM</Link>
          <Link className="underline" href={`/crm/partenaires/${partenaire.id}`}>Fiche partenaire (CRM)</Link>
        </nav>
      </div>

      {/* KPIs */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Vue d’ensemble</h2>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(kpis.counts).map(([s, n]) => (
            <div key={s} className="border rounded p-3">
              <div className="text-sm text-gray-600">{s}</div>
              <div className="text-2xl font-bold">{n}</div>
            </div>
          ))}
          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">Commissions (mois)</div>
            <div className="text-2xl font-bold">{fmtEur(kpis.commMonth)}</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">Commissions (total)</div>
            <div className="text-2xl font-bold">{fmtEur(kpis.commTotal || partenaire.commissions_total)}</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">CA total (référence)</div>
            <div className="text-2xl font-bold">{fmtEur(partenaire.ca_total)}</div>
          </div>
        </div>
        {Object.keys(kpis.caYear).length > 0 && (
          <div className="text-sm text-gray-700">
            CA par année:&nbsp;
            {Object.entries(kpis.caYear)
              .sort(([a],[b]) => a.localeCompare(b))
              .map(([year, ca], i, arr) => (
                <span key={year}>
                  {year}: {fmtEur(ca)}{i < arr.length - 1 ? " • " : ""}
                </span>
              ))}
          </div>
        )}
      </section>

      {/* Suivi des dossiers */}
      <section className="border rounded p-4 space-y-3">
        <h3 className="font-semibold">Suivi des dossiers</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Statut</span>
            <select className="border rounded p-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="all">Tous</option>
              {statusesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Du</span>
            <input type="date" className="border rounded p-2" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Au</span>
            <input type="date" className="border rounded p-2" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Commission min (€)</span>
            <input type="number" step="0.01" className="border rounded p-2" value={minCommission} onChange={(e)=>setMinCommission(e.target.value)} />
          </label>
        </div>
        <div className="flex gap-3">
          <button className="border rounded px-3 py-2" onClick={() => { setStatus("all"); setDateFrom(""); setDateTo(""); setMinCommission(""); }}>
            Réinitialiser
          </button>
          <button className="border rounded px-3 py-2" onClick={exportCSV}>
            Export CSV (Excel)
          </button>
          <div className="self-center text-sm text-gray-600">
            {filtered.length} dossier(s) sur {dossiers.length}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-600 mt-2">Aucun résultat.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1 mt-2">
            {filtered.map(d => (
              <li key={d.id}>
                <span className="font-semibold">#{d.id}</span> — {d.statut}
                {" • "}créé: {d.date_creation || "-"}
                {" • "}commission: {fmtEur(d.commission_partenaire_eur)}
                {" • "}client: <Link className="underline" href={`/crm/clients/${d.client_id}`}>#{d.client_id}</Link>
                {" • "}entreprise: <Link className="underline" href={`/crm/entreprises/${d.entreprise_id}`}>#{d.entreprise_id}</Link>
                {(d.blocages || []).length ? <> {" • "}blocages: {(d.blocages || []).join(", ")}</> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Facturation & commissions */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold">Module de facturation & commissions</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">Commissions à reverser (mois)</div>
            <div className="text-2xl font-bold">{fmtEur(kpis.commMonth)}{taux ? `  •  taux ${taux}%` : ""}</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">Coordonnées de facturation</div>
            <div className="text-sm">
              {partenaire.coordonnees_facturation?.societe || "-"}<br/>
              {partenaire.coordonnees_facturation?.email_facturation || "-"}<br/>
              {partenaire.coordonnees_facturation?.adresse || "-"}
            </div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">Paiement</div>
            <div className="text-sm">
              Mode: {partenaire.paiement?.mode || "-"}<br/>
              IBAN: {partenaire.paiement?.iban || "-"}<br/>
              BIC: {partenaire.paiement?.bic || "-"}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mt-2">Historique des factures</h4>
          <ul className="list-disc pl-6">
            {factures.length ? factures.map(f => (
              <li key={f.id}>
                {f.id} — {fmtEur(f.montant)} — {f.statut || "-"} — période {f.periode || "-"} — {f.date} — échéance {f.echeance || "-"} — PDF {f.pdf || "-"}
              </li>
            )) : <li>Aucune facture</li>}
          </ul>
        </div>
      </section>

      {/* Espace documentaire */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">Espace documentaire</h3>
        <ul className="list-disc pl-6">
          <li>Contrat de partenariat: {docs.contrat_pdf || "-"}</li>
          <li>Modalités de collaboration: {docs.modalites_collaboration_pdf || "-"}</li>
          {(docs.documentation_tech || []).map((d, i) => (
            <li key={i}>{d.type || "Doc"} — {d.url || "-"}</li>
          ))}
          {(!docs.documentation_tech || docs.documentation_tech.length === 0) && <li>Aucune documentation technique</li>}
        </ul>
      </section>

      {/* Accès */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">Accès & sécurité</h3>
        <ul className="list-disc pl-6">
          <li>Utilisateurs côté partenaire: {partnerUsers.length || 0}</li>
          <li>2FA activée (comptes): {partnerUsers.filter(u => u.two_fa_enabled).length} / {partnerUsers.length}</li>
        </ul>
      </section>

      {/* Exports partenaire */}
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">Exports</h3>
        <ul className="list-disc pl-6">
          {exportsHist.length ? exportsHist.map(e => (
            <li key={e.id}>
              {e.generated_at} — {e.format} — filtres {JSON.stringify(e.filtres || {})} — fichier {e.file || "-"}
            </li>
          )) : <li>Aucun export</li>}
        </ul>
      </section>
    </main>
  );
}
