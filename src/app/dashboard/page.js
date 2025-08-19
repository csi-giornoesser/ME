"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function parseISO(d){ return d ? new Date(d) : null; }
function inRange(d, from, to) {
  if (!d) return true;
  const dt = typeof d === "string" ? new Date(d) : d;
  if (from && dt < from) return false;
  if (to) { const end = new Date(to); end.setHours(23,59,59,999); if (dt > end) return false; }
  return true;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("all");
  const [partnerId, setPartnerId] = useState("all");
  const [operatorId, setOperatorId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData);
  }, []);

  const partners   = data?.partenaires ?? [];
  const operators  = data?.operateurs ?? [];
  const dossiers   = data?.dossiers ?? [];
  const clients    = data?.clients ?? [];
  const statusesRef= data?.refs?.statuts_dossier ?? [];
  const notifications = data?.notifications_queue ?? [];
  const authLogs   = data?.auth_logs ?? [];
  const isLoading  = !data;

  const filtered = useMemo(() => {
    const from = dateFrom ? parseISO(dateFrom) : null;
    const to   = dateTo   ? parseISO(dateTo)   : null;
    return dossiers.filter(d => {
      const okStatus   = status === "all" ? true : d.statut === status;
      const okPartner  = partnerId === "all" ? true : String(d.partenaireId) === String(partnerId);
      const okOperator = operatorId === "all" ? true : String(d.operateurId) === String(operatorId);
      const okDate     = inRange(d.date_creation, from, to);
      return okStatus && okPartner && okOperator && okDate;
    });
  }, [dossiers, status, partnerId, operatorId, dateFrom, dateTo]);

  const kpis = useMemo(() => {
    const counts = {};
    (statusesRef.length ? statusesRef : Array.from(new Set(dossiers.map(d=>d.statut)))).forEach(s => counts[s]=0);
    filtered.forEach(d => counts[d.statut] = (counts[d.statut]||0)+1);
    return counts;
  }, [filtered, dossiers, statusesRef]);

  const clientById = (id) => clients.find(c => String(c.id)===String(id));
  const partById   = (id) => partners.find(p => String(p.id)===String(id));
  const resetFilters = () => { setStatus("all"); setPartnerId("all"); setOperatorId("all"); setDateFrom(""); setDateTo(""); };

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/" className="underline">← Retour</Link>
        <h1 className="text-2xl font-bold">Dashboard — filtres</h1>
        {isLoading && <span className="text-sm text-gray-500">Chargement…</span>}
      </div>

      {/* Filtres */}
      <section className="border rounded p-4 space-y-3">
        <div className="grid md:grid-cols-5 gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Statut</span>
            <select className="border rounded p-2" value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="all">Tous</option>
              {(statusesRef.length ? statusesRef : Array.from(new Set(dossiers.map(d=>d.statut)))).map(s=>(
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Partenaire</span>
            <select className="border rounded p-2" value={partnerId} onChange={e=>setPartnerId(e.target.value)}>
              <option value="all">Tous</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Opérateur</span>
            <select className="border rounded p-2" value={operatorId} onChange={e=>setOperatorId(e.target.value)}>
              <option value="all">Tous</option>
              {operators.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Du</span>
            <input type="date" className="border rounded p-2" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Au</span>
            <input type="date" className="border rounded p-2" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
          </label>
        </div>
        <div className="flex gap-3">
          <button className="border rounded px-3 py-2" onClick={resetFilters}>Réinitialiser</button>
          <div className="text-sm text-gray-600 self-center">{filtered.length} dossier(s) sur {dossiers.length}</div>
        </div>
      </section>

      {/* KPIs */}
      <section>
        <h2 className="text-xl font-semibold mb-2">KPIs dossiers (filtrés)</h2>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(kpis).map(([s,n])=>(
            <div key={s} className="border rounded p-3">
              <div className="text-sm text-gray-600">{s}</div>
              <div className="text-2xl font-bold">{n}</div>
            </div>
          ))}
          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold">{filtered.length}</div>
          </div>
        </div>
      </section>

      {/* Dossiers */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Dossiers</h2>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-600">{isLoading ? "Chargement…" : "Aucun résultat."}</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {filtered.map(d => (
              <li key={d.id}>
                <span className="font-semibold">#{d.id}</span> — statut: {d.statut} — créé: {d.date_creation} — modif: {d.derniere_modification}
                {" — "}client: {clientById(d.clientId)
                  ? <Link className="underline" href={`/clients/${d.clientId}`}>{clientById(d.clientId).prenom} {clientById(d.clientId).nom}</Link>
                  : d.clientId}
                {" — "}partenaire: {partById(d.partenaireId)
                  ? <Link className="underline" href={`/partenaires/${d.partenaireId}`}>{partById(d.partenaireId).nom}</Link>
                  : d.partenaireId}
                {" — "}entreprise: <Link className="underline" href={`/entreprises/${d.entrepriseId}`}>#{d.entrepriseId}</Link>
                {(d.blocages || []).length ? <> — blocages: {(d.blocages || []).join(", ")}</> : null}
                {" — "}commission: {d.commission_partenaire_eur ?? 0}€
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Notifications & relances</h2>
        <ul className="list-disc pl-6 space-y-1">
          {notifications.map(n => (
            <li key={n.id}>
              {n.type} — client <Link className="underline" href={`/clients/${n.clientId}`}>#{n.clientId}</Link> — dossier #{n.dossierId} — {n.canal} — prévu le {n.scheduled_for}
            </li>
          ))}
          {notifications.length === 0 && <li>Aucune notification.</li>}
        </ul>
      </section>

      {/* Connexions */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Connexions (sécurité)</h2>
        <ul className="list-disc pl-6 space-y-1">
          {authLogs.map((l,i)=>(
            <li key={i}>{l.at} — {l.role} {l.who} — {l.action} — {l.success ? "✅" : "❌"} — IP {l.ip}</li>
          ))}
          {authLogs.length === 0 && <li>Aucune entrée.</li>}
        </ul>
      </section>
    </main>
  );
}
