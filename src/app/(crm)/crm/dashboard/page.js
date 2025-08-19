"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function parseISO(d){ return d ? new Date(d) : null; }
function inRange(d, from, to){
  if (!d) return true;
  const dt = typeof d === "string" ? new Date(d) : d;
  if (from && dt < from) return false;
  if (to) { const end = new Date(to); end.setHours(23,59,59,999); if (dt > end) return false; }
  return true;
}

export default function Dashboard() {
  // Filtres
  const [status, setStatus] = useState("all");
  const [partnerId, setPartnerId] = useState("all");
  const [operatorId, setOperatorId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Données
  const [data, setData] = useState(null);
  const [err,  setErr]  = useState(null);
  const isLoading = !data && !err;

  // Fetch unique réutilisable
  async function load() {
    const qs = new URLSearchParams();
    if (status    !== "all") qs.set("status", status);
    if (partnerId !== "all") qs.set("partnerId", partnerId);
    if (operatorId!== "all") qs.set("operatorId", operatorId);
    if (dateFrom)            qs.set("from", dateFrom);
    if (dateTo)              qs.set("to", dateTo);

    setErr(null);
    try {
      const r = await fetch(`/api/dashboard?${qs.toString()}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      setData(json);
    } catch (e) {
      setErr(String(e));
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status, partnerId, operatorId, dateFrom, dateTo]);

  // --- Actions (appellent l'API puis rechargent)
  async function changeStatut(dossierId, newStatut) {
    await fetch(`/api/dossiers/${dossierId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: newStatut })
    });
    await load();
  }

  async function createTicket(dossierId) {
    await fetch(`/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dossier_id: dossierId,
        priorite: "Moyenne",
        message: "Ouvert depuis dashboard"
      })
    });
    await load();
  }

  async function planRelance(dossierId, clientId) {
    const in1h = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await fetch(`/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "relance_piece",
        client_id: clientId,
        dossier_id: dossierId,
        canal: "email",
        scheduled_for: in1h
      })
    });
    await load();
  }

  // --- Dérivées
  const partners = data?.partenaires ?? [];
  const operators = data?.operateurs ?? [];
  const dossiers = data?.dossiers ?? [];
  const clients = data?.clients ?? [];
  const statusesRef = data?.refs?.statuts_dossier ?? [];
  const notifications = data?.notifications_queue ?? [];
  const authLogs = data?.auth_logs ?? [];

  const filtered = useMemo(() => {
    const from = dateFrom ? parseISO(dateFrom) : null;
    const to = dateTo ? parseISO(dateTo) : null;
    return dossiers.filter((d) => {
      const okStatus   = status === "all" ? true : d.statut === status;
      const okPartner  = partnerId === "all" ? true : String(d.partenaireId) === String(partnerId);
      const okOperator = operatorId === "all" ? true : String(d.operateurId) === String(operatorId);
      const okDate     = inRange(d.date_creation, from, to);
      return okStatus && okPartner && okOperator && okDate;
    });
  }, [dossiers, status, partnerId, operatorId, dateFrom, dateTo]);

  const kpis = useMemo(() => {
    const counts = {};
    (statusesRef.length ? statusesRef : Array.from(new Set(dossiers.map(d => d.statut))))
      .forEach(s => counts[s] = 0);
    filtered.forEach(d => counts[d.statut] = (counts[d.statut] || 0) + 1);
    return counts;
  }, [filtered, dossiers, statusesRef]);

  const clientById = (id) => clients.find(c => String(c.id) === String(id));
  const partById   = (id) => partners.find(p => String(p.id) === String(id));
  const resetFilters = () => { setStatus("all"); setPartnerId("all"); setOperatorId("all"); setDateFrom(""); setDateTo(""); };

  if (err) return <main className="p-6"><h1 className="text-xl font-bold">Erreur</h1><pre className="mt-2">{err}</pre></main>;
  if (isLoading) return <main className="p-6">Chargement…</main>;

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">CRM — Dashboard</h1>
      </div>

      {/* Filtres */}
      <section className="border rounded p-4 space-y-3">
        <div className="grid md:grid-cols-5 gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Statut</span>
            <select className="border rounded p-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="all">Tous</option>
              {(statusesRef.length ? statusesRef : Array.from(new Set(dossiers.map(d=>d.statut)))).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Partenaire</span>
            <select className="border rounded p-2" value={partnerId} onChange={(e)=>setPartnerId(e.target.value)}>
              <option value="all">Tous</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Opérateur</span>
            <select className="border rounded p-2" value={operatorId} onChange={(e)=>setOperatorId(e.target.value)}>
              <option value="all">Tous</option>
              {operators.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
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
          {Object.entries(kpis).map(([s, n]) => (
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
          <p className="text-sm text-gray-600">Aucun résultat avec ces filtres.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {filtered.map(d => (
              <li key={d.id}>
                <span className="font-semibold">#{d.id}</span> — statut: {d.statut} — créé: {d.date_creation} — modif: {d.derniere_modification ?? "-"}
                {" — "}client: {clientById(d.clientId)
                  ? <Link className="underline" href={`/crm/clients/${d.clientId}`}>{clientById(d.clientId).prenom} {clientById(d.clientId).nom}</Link>
                  : d.clientId}
                {" — "}partenaire: {partById(d.partenaireId)
                  ? <Link className="underline" href={`/crm/partenaires/${d.partenaireId}`}>{partById(d.partenaireId).nom}</Link>
                  : d.partenaireId}
                {" — "}entreprise: <Link className="underline" href={`/crm/entreprises/${d.entrepriseId}`}>#{d.entrepriseId}</Link>
                {(d.blocages || []).length ? <> — blocages: {(d.blocages || []).join(", ")}</> : null}
                {" — "}commission: {d.commission_partenaire_eur ?? 0}€

                {/* Actions */}
                <div className="inline-flex gap-2 ml-2">
                  <select
                    className="border rounded px-1 py-0.5 text-sm"
                    value={d.statut}
                    onChange={(e) => changeStatut(d.id, e.target.value)}
                  >
                    {["nouveau","en_cours","en_attente","a_corriger","valide","rejete"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <button className="border rounded px-2 py-0.5 text-sm" onClick={() => createTicket(d.id)}>
                    + Ticket
                  </button>

                  <button className="border rounded px-2 py-0.5 text-sm" onClick={() => planRelance(d.id, d.clientId)}>
                    Relancer (1h)
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Notifications & relances programmées</h2>
        <ul className="list-disc pl-6 space-y-1">
          {notifications.length ? notifications.map(n => (
            <li key={n.id}>
              {n.type} — client <Link className="underline" href={`/crm/clients/${n.clientId}`}>#{n.clientId}</Link> — dossier #{n.dossierId} — {n.canal} — prévu le {n.scheduled_for}
            </li>
          )) : <li>Aucune notification programmée.</li>}
        </ul>
      </section>

      {/* Connexions */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Connexions (sécurité)</h2>
        <ul className="list-disc pl-6 space-y-1">
          {authLogs.length ? authLogs.map((l,i) => (
            <li key={i}>{l.at} — {l.role} {l.who} — {l.action} — {l.success ? "✅" : "❌"} — IP {l.ip}</li>
          )) : <li>Aucune entrée</li>}
        </ul>
      </section>
    </main>
  );
}
