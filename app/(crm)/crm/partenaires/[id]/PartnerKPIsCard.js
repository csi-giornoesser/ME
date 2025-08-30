"use client";
import { useEffect, useMemo, useState } from "react";

/* --- Utils d'affichage --- */
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const fmtNumber = (n) =>
  Number.isFinite(Number(n)) ? Number(n).toLocaleString("fr-FR") : "0";

/* --- Mapping Tailwind (évite les classes dynamiques qui cassent au build) --- */
const COLOR_STYLES = {
  blue:    { box: "bg-blue-50 border-blue-200",    value: "text-blue-800",    title: "text-blue-700",    sub: "text-blue-600" },
  orange:  { box: "bg-orange-50 border-orange-200",value: "text-orange-800",  title: "text-orange-700",  sub: "text-orange-600" },
  green:   { box: "bg-green-50 border-green-200",  value: "text-green-800",   title: "text-green-700",   sub: "text-green-600" },
  red:     { box: "bg-red-50 border-red-200",      value: "text-red-800",     title: "text-red-700",     sub: "text-red-600" },
  purple:  { box: "bg-purple-50 border-purple-200",value: "text-purple-800",  title: "text-purple-700",  sub: "text-purple-600" },
  indigo:  { box: "bg-indigo-50 border-indigo-200",value: "text-indigo-800",  title: "text-indigo-700",  sub: "text-indigo-600" },
  teal:    { box: "bg-teal-50 border-teal-200",    value: "text-teal-800",    title: "text-teal-700",    sub: "text-teal-600" },
  emerald: { box: "bg-emerald-50 border-emerald-200", value: "text-emerald-800", title: "text-emerald-700", sub: "text-emerald-600" },
  lime:    { box: "bg-lime-50 border-lime-200",    value: "text-lime-800",    title: "text-lime-700",    sub: "text-lime-600" },
  gray:    { box: "bg-gray-50 border-gray-200",    value: "text-gray-800",    title: "text-gray-700",    sub: "text-gray-600" },
};

export default function PartnerKPIsCard({ partnerId }) {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  // ✅ pas d’accès direct quand kpis est null
const periodLabel = useMemo(() => {
  const m = kpis?.periode?.moisActuel;   // ← garde
  if (!m) return "—";
  const [y, mm] = m.split("-");
  const d = new Date(Number(y), Number(mm) - 1, 1);
  return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
}, [kpis?.periode?.moisActuel]);


  useEffect(() => {
    if (!partnerId) return;
    const ac = new AbortController();
    loadKpis({ signal: ac.signal });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  async function loadKpis({ signal } = {}) {
  try {
     console.log("DEBUT LOAD KPIS"); 
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/partenaires/${partnerId}`, { cache: "no-store", signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    
    console.log("=== DEBUG COMMISSIONS ===");
    console.log("Partenaire taux:", raw.partenaire?.taux_commission);
    console.log("CA par période:", raw.ca_par_periode);
    console.log("Commissions total partenaire:", raw.partenaire?.commissions_total);
    
    setKpis(computeKpis(raw));
  } catch (e) {
    if (e.name === "AbortError") return;
    console.error("Erreur KPIs:", e);
    setError("Impossible de charger les KPIs");
  } finally {
    setLoading(false);
  }
}

  function computeKpis(raw) {
  const p         = raw?.partenaire ?? {};
  const caList    = Array.isArray(raw?.ca_par_periode) ? raw.ca_par_periode : [];
  const dossiers  = Array.isArray(raw?.dossiers) ? raw.dossiers : [];
  const factures  = Array.isArray(raw?.factures) ? raw.factures : [];

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // "YYYY-MM"
  const currentYear  = String(now.getFullYear());
  const prevMonthObj = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevMonthObj.toISOString().slice(0, 7);

  // Dossiers
  const enCoursSet = new Set(["nouveau","en_cours","en_attente","a_corriger"]);
  const total         = dossiers.length;
  const enCours       = dossiers.filter(d => enCoursSet.has(d.statut)).length;
  const valides       = dossiers.filter(d => d.statut === "valide").length;
  const rejetes       = dossiers.filter(d => d.statut === "rejete").length;
  const bloques       = dossiers.filter(d => (d.blocages || []).length > 0).length;
  const tauxConversion = total > 0 ? Math.round((valides / total) * 100) : 0;

  // CA & commissions (nombre safe)
  const getPeriodEntry = (peri) => caList.find(x => x.periode === peri) || {};
  const num = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;

  const caTotal     = num(p.ca_total);
  const commsTotal  = num(p.commissions_total);
  const caMonth     = num(getPeriodEntry(currentMonth).ca);

  // Fallback commissions par période si l'API renvoie null
  const tauxCommission = num(p.taux_commission);
  const commOf = (x) => {
  const c = x?.commissions;
  // Si commissions existe ET n'est pas null/undefined, l'utiliser
  if (c !== null && c !== undefined && Number.isFinite(Number(c))) {
    return Number(c);
  }
  // Sinon fallback sur CA * taux
  return Number(x?.ca || 0) * tauxCommission / 100;
};

  // Sommes mois et année (avec fallback)
  const commsMonth = caList
    .filter(x => x.periode === currentMonth)
    .reduce((s, x) => s + commOf(x), 0);

  const caYear  = caList
    .filter(x => String(x.periode || "").startsWith(currentYear))
    .reduce((s, x) => s + num(x.ca), 0);

  const commsYear = caList
    .filter(x => String(x.periode || "").startsWith(currentYear))
    .reduce((s, x) => s + commOf(x), 0);

  const caPrev = num(getPeriodEntry(prevMonthStr).ca);
  const evolutionMensuelle = caPrev > 0
    ? Math.round(((caMonth - caPrev) / caPrev) * 100)
    : (caMonth > 0 ? 100 : 0);

  // Factures impayées
  const impayees = factures.filter(f => ["impayee","en_attente"].includes(f.statut));
  const montantImpaye = impayees.reduce((s, f) => s + num(f.montant), 0);

  // Performance
  const dossiersPayes = caList.reduce((s, x) => s + Number(x.dossiers || 0), 0);
  const moyenneCaParDossier = dossiersPayes > 0 ? Math.round(caTotal / dossiersPayes) : 0;

  // Alertes “factuelles”
  const alertes = [];
  if (bloques > 0)               alertes.push(`${bloques} dossier(s) bloqué(s)`);
  if (impayees.length > 0)       alertes.push(`${impayees.length} facture(s) impayée(s)`);
  if (enCours === 0 && total>0)  alertes.push("Aucun dossier en cours");
  console.log("=== CALCULS DEBUG ===");
console.log("caList:", caList);
console.log("tauxCommission:", tauxCommission);
console.log("currentMonth:", currentMonth);
console.log("Période courante trouvée:", caList.filter(x => x.periode === currentMonth));
console.log("commissionsMoisActuel calculé:", commsMonth);
console.log("commissionsAnnuelles calculé:", commsYear);

  return {
    dossiers: { total, enCours, valides, rejetes, bloques, tauxConversion },
    financier: {
      caTotal,
      caMoisActuel: caMonth,
      caAnnuel: caYear,
      commissionsTotal: commsTotal,
      commissionsMoisActuel: commsMonth,
      commissionsAnnuelles: commsYear,
      facturesImpayees: impayees.length,
      montantImpaye,
      evolutionMensuelle
    },
    performance: { tauxCommission, moyenneCaParDossier, tauxConversion },
    alertes,
    periode: { moisActuel: currentMonth, anneeActuelle: currentYear },
  };
}


  const KPIBox = ({ title, value, subtitle, color="gray", trend=null, urgent=false }) => {
    const palette = COLOR_STYLES[urgent ? "red" : color] || COLOR_STYLES.gray;
    return (
      <div className={`border rounded-lg p-4 text-center ${palette.box}`}>
        <div className={`text-2xl font-bold ${palette.value}`}>{value}</div>
        <div className={`text-sm font-medium ${palette.title}`}>{title}</div>
        {subtitle && <div className={`text-xs mt-1 ${palette.sub}`}>{subtitle}</div>}
        {Number.isFinite(trend) && (
          <div className={`text-xs mt-1 flex items-center justify-center gap-1 ${
            trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"
          }`}>
            <span>{trend > 0 ? "↗️" : trend < 0 ? "↘️" : "→"}</span>
            <span>{trend > 0 ? "+" : ""}{trend}%</span>
          </div>
        )}
      </div>
    );
  };

  /* ---------- Rendu ---------- */

  if (loading && !kpis) {
    return (
      <section className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Tableau de Bord</h3>
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded" />)}
        </div>
      </section>
    );
  }

  if (error && !kpis) {
    return (
      <section className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Tableau de Bord</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="text-red-800">❌ {error}</div>
          <button
            onClick={() => loadKpis()}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            🔄 Réessayer
          </button>
        </div>
      </section>
    );
  }

  if (!kpis) return null;

  

  return (
    <section className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">📊 Tableau de Bord</h3>
          <p className="text-sm text-gray-600">
            Période : {periodLabel} • Année : {kpis?.periode?.anneeActuelle ?? "—"}
          </p>

        </div>
        <button
          onClick={() => loadKpis()}
          disabled={loading}
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md disabled:opacity-50"
        >
          🔄 Actualiser
        </button>
      </div>

      {(kpis.alertes?.length ?? 0) > 0 && (
  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-orange-600">⚠️</span>
      <span className="font-medium text-orange-800">Alertes</span>
    </div>
    <ul className="text-sm text-orange-700 space-y-1">
      {kpis.alertes.map((a, i) => <li key={i}>• {a}</li>)}
    </ul>
  </div>
)}


      {/* Dossiers */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">📂 Dossiers</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KPIBox title="Total"    value={fmtNumber(kpis.dossiers.total)}   color="blue" />
          <KPIBox title="En cours" value={fmtNumber(kpis.dossiers.enCours)} color="orange"
                  urgent={kpis.dossiers.enCours === 0 && kpis.dossiers.total > 0} />
          <KPIBox title="Validés"  value={fmtNumber(kpis.dossiers.valides)} color="green" />
          <KPIBox title="Bloqués"  value={fmtNumber(kpis.dossiers.bloques)} color="red"
                  urgent={kpis.dossiers.bloques > 0} />
          <KPIBox title="Taux succès" value={`${fmtNumber(kpis.dossiers.tauxConversion)}%`} color="purple" />
        </div>
      </div>

      {/* CA */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">💰 Chiffre d'affaires</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIBox title="Ce mois" value={`${fmtNumber(kpis.financier.caMoisActuel)}€`}
                  subtitle="CA mensuel" color="blue" trend={kpis.financier.evolutionMensuelle} />
          <KPIBox title="Cette année" value={`${fmtNumber(kpis.financier.caAnnuel)}€`}
                  subtitle="CA annuel" color="indigo" />
          <KPIBox title="Total historique" value={`${fmtNumber(kpis.financier.caTotal)}€`}
                  subtitle="Depuis création" color="green" />
          <KPIBox title="Moyenne/dossier" value={`${fmtNumber(kpis.performance.moyenneCaParDossier)}€`}
                  subtitle="CA moyen" color="teal" />
        </div>
      </div>

      {/* Commissions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">💸 Commissions à recevoir</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <KPIBox title="Ce mois" value={`${fmtNumber(kpis.financier.commissionsMoisActuel)}€`}
                  subtitle={`Taux: ${fmtNumber(kpis.performance.tauxCommission)}%`} color="emerald" />
          <KPIBox title="Cette année" value={`${fmtNumber(kpis.financier.commissionsAnnuelles)}€`}
                  subtitle="Commissions" color="green" />
          <KPIBox title="Total historique" value={`${fmtNumber(kpis.financier.commissionsTotal)}€`}
                  subtitle="Depuis création" color="lime" />
        </div>
      </div>

      {/* Facturation */}
      {(kpis.financier.facturesImpayees > 0 || kpis.financier.montantImpaye > 0) && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">🧾 Facturation</h4>
          <div className="grid grid-cols-2 gap-3">
            <KPIBox title="Factures impayées" value={fmtNumber(kpis.financier.facturesImpayees)}
                    color="red" urgent />
            <KPIBox title="Montant en attente" value={`${fmtNumber(kpis.financier.montantImpaye)}€`}
                    color="red" urgent />
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center pt-4 border-t">
        Dernière actualisation : {fmtDate(new Date())} à {new Date().toLocaleTimeString("fr-FR")}
      </div>
    </section>
  );
}
