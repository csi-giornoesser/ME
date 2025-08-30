"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function TicketsPage() {
  // Filtres
  const [statut, setStatut] = useState("all");
  const [priorite, setPriorite] = useState("all");
  const [operatorId, setOperatorId] = useState("all");
  const [limit, setLimit] = useState(50);

  // Données
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch avec filtres
  async function loadTickets() {
    const qs = new URLSearchParams();
    if (statut !== "all") qs.set("statut", statut);
    if (priorite !== "all") qs.set("priorite", priorite);
    if (operatorId !== "all") qs.set("operatorId", operatorId);
    qs.set("limit", limit.toString());

    setErr(null);
    setLoading(true);

    try {
      const r = await fetch(`/api/tickets?${qs.toString()}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      setData(json);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
    /* eslint-disable-next-line */
  }, [statut, priorite, operatorId, limit]);

  // Actions rapides
  async function quickChangeStatut(ticketId, newStatut) {
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatut })
      });
      await loadTickets();
    } catch (e) {
      console.error("Erreur changement statut:", e);
    }
  }

  async function quickAssign(ticketId, operatorId) {
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          assigne_operateur_id: operatorId === "none" ? null : parseInt(operatorId)
        })
      });
      await loadTickets();
    } catch (e) {
      console.error("Erreur assignation:", e);
    }
  }

  // Dérivées
  const tickets = data?.tickets ?? [];
  const filters = data?.filters ?? {};
  const statuts = filters.statuts ?? [];
  const priorites = filters.priorites ?? [];
  const operateurs = filters.operateurs ?? [];

  // KPIs
  const kpis = useMemo(() => {
    const counts = {};
    statuts.forEach(s => counts[s] = 0);
    tickets.forEach(t => counts[t.statut] = (counts[t.statut] || 0) + 1);
    return counts;
  }, [tickets, statuts]);

  const resetFilters = () => {
    setStatut("all");
    setPriorite("all");
    setOperatorId("all");
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "Haute": return "text-red-600 font-semibold";
      case "Moyenne": return "text-orange-600";
      case "Basse": return "text-gray-600";
      default: return "";
    }
  };

  const getStatutColor = (s) => {
    switch (s) {
      case "Nouveau": return "bg-blue-100 text-blue-800";
      case "En cours": return "bg-yellow-100 text-yellow-800";
      case "Résolu": return "bg-green-100 text-green-800";
      case "Fermé": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100";
    }
  };

  if (err) return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Erreur</h1>
      <pre className="mt-2">{err}</pre>
    </main>
  );

  if (loading) return <main className="p-6">Chargement des tickets…</main>;

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Tickets de support</h1>
        <Link 
          href="/crm/dashboard" 
          className="text-sm text-blue-600 underline"
        >
          ← Retour dashboard
        </Link>
      </div>

      {/* Filtres */}
      <section className="border rounded p-4 space-y-3">
        <div className="grid md:grid-cols-4 gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Statut</span>
            <select 
              className="border rounded p-2" 
              value={statut} 
              onChange={(e) => setStatut(e.target.value)}
            >
              <option value="all">Tous</option>
              {statuts.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Priorité</span>
            <select 
              className="border rounded p-2" 
              value={priorite} 
              onChange={(e) => setPriorite(e.target.value)}
            >
              <option value="all">Toutes</option>
              {priorites.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Opérateur</span>
            <select 
              className="border rounded p-2" 
              value={operatorId} 
              onChange={(e) => setOperatorId(e.target.value)}
            >
              <option value="all">Tous</option>
              {operateurs.map(op => (
                <option key={op.id} value={op.id}>{op.nom}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Limite</span>
            <select 
              className="border rounded p-2" 
              value={limit} 
              onChange={(e) => setLimit(parseInt(e.target.value))}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3">
          <button className="border rounded px-3 py-2" onClick={resetFilters}>
            Réinitialiser
          </button>
          <div className="text-sm text-gray-600 self-center">
            {tickets.length} ticket(s) affiché(s) / {data?.total ?? 0} total
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section>
        <h2 className="text-xl font-semibold mb-2">État des tickets</h2>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(kpis).map(([s, n]) => (
            <div key={s} className="border rounded p-3">
              <div className="text-sm text-gray-600">{s}</div>
              <div className="text-2xl font-bold">{n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Liste des tickets */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-sm text-gray-600">Aucun ticket avec ces filtres.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="border rounded p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/crm/tickets/${ticket.id}`}
                        className="font-semibold text-blue-600 underline"
                      >
                        #{ticket.id} — {ticket.subject}
                      </Link>
                      <span className={`px-2 py-1 rounded text-xs ${getStatutColor(ticket.statut)}`}>
                        {ticket.statut}
                      </span>
                      <span className={`text-sm ${getPriorityColor(ticket.priorite)}`}>
                        {ticket.priorite}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mt-1">
                      Dossier #
                      <Link href={`/crm/dashboard`} className="underline">
                        {ticket.dossier_id}
                      </Link>
                      {" — "}Client: 
                      <Link href={`/crm/clients/${ticket.client_id}`} className="underline">
                        {ticket.prenom} {ticket.nom}
                      </Link>
                      {" — "}Créé: {new Date(ticket.created_at).toLocaleDateString("fr-FR")}
                    </div>

                    {ticket.dernier_message && (
                      <div className="text-sm bg-gray-50 p-2 rounded mt-2">
                        <strong>Dernier message:</strong> {ticket.dernier_message}
                        <span className="text-gray-500 ml-2">
                          ({new Date(ticket.dernier_event_at).toLocaleDateString("fr-FR")})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 text-sm">
                    {/* Actions rapides */}
                    <select
                      className="border rounded px-2 py-1"
                      value={ticket.statut}
                      onChange={(e) => quickChangeStatut(ticket.id, e.target.value)}
                    >
                      {statuts.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <select
                      className="border rounded px-2 py-1"
                      value={ticket.assigne_operateur_id || "none"}
                      onChange={(e) => quickAssign(ticket.id, e.target.value)}
                    >
                      <option value="none">Non assigné</option>
                      {operateurs.map(op => (
                        <option key={op.id} value={op.id}>{op.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {ticket.operateur_nom && (
                  <div className="text-sm text-gray-600">
                    Assigné à: {ticket.operateur_nom} ({ticket.operateur_email})
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}