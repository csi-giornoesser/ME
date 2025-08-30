"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const fmt = (d) => d ? new Date(d).toLocaleString("fr-FR") : "-";

export default function TicketDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Formulaire nouveau message
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Chargement données
  useEffect(() => {
    if (!id) return;
    
    const ctrl = new AbortController();
    setLoading(true);
    setErr(null);
    
    fetch(`/api/tickets/${id}`, { 
      cache: "no-store", 
      signal: ctrl.signal 
    })
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status} ${r.statusText} — ${text}`);
        }
        return r.json();
      })
      .then(setData)
      .catch((e) => {
        if (!ctrl.signal.aborted) setErr(String(e));
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    
    return () => ctrl.abort();
  }, [id]);

  // Actions
  async function updateTicket(updates) {
    try {
      const r = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      
      // Recharger les données
      window.location.reload();
    } catch (e) {
      console.error("Erreur mise à jour:", e);
      alert("Erreur lors de la mise à jour");
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;
    
    setSendingMessage(true);
    try {
      const r = await fetch(`/api/tickets/${id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.trim() })
      });
      
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      
      setNewMessage("");
      // Recharger les données
      window.location.reload();
    } catch (e) {
      console.error("Erreur envoi message:", e);
      alert("Erreur lors de l'envoi du message");
    } finally {
      setSendingMessage(false);
    }
  }

  if (loading) return <main className="p-6">Chargement du ticket…</main>;
  
  if (err) return (
    <main className="p-6 space-y-2">
      <Link href="/crm/tickets">← Retour aux tickets</Link>
      <h1 className="text-xl font-bold mt-2">Erreur</h1>
      <pre className="text-sm bg-gray-100 p-3 rounded">{err}</pre>
    </main>
  );
  
  if (!data?.ticket) return (
    <main className="p-6">
      <Link href="/crm/tickets">← Retour aux tickets</Link>
      <h1 className="text-xl font-bold mt-2">Ticket introuvable</h1>
    </main>
  );

  const ticket = data.ticket;
  const events = data.events ?? [];
  const operateurs = data.operateurs ?? [];
  const refs = data.references ?? {};

  const getStatutColor = (s) => {
    switch (s) {
      case "Nouveau": return "bg-blue-100 text-blue-800";
      case "En cours": return "bg-yellow-100 text-yellow-800";
      case "Résolu": return "bg-green-100 text-green-800";
      case "Fermé": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100";
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "Haute": return "text-red-600 font-semibold";
      case "Moyenne": return "text-orange-600";
      case "Basse": return "text-gray-600";
      default: return "";
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/crm/tickets" className="text-blue-600 underline">
          ← Retour aux tickets
        </Link>
        <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
      </div>

      {/* Header ticket */}
      <section className="border rounded p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{ticket.subject}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2 py-1 rounded text-sm ${getStatutColor(ticket.statut)}`}>
                {ticket.statut}
              </span>
              <span className={`text-sm ${getPriorityColor(ticket.priorite)}`}>
                Priorité: {ticket.priorite}
              </span>
              <span className="text-sm text-gray-600">
                Créé: {fmt(ticket.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Infos contexte */}
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium">Dossier</h4>
            <p>
              Dossier #{ticket.dossier_id} — Statut: {ticket.dossier_statut}
              <br />
              Créé le: {fmt(ticket.dossier_date_creation)}
              {ticket.commission_partenaire_eur && (
                <><br />Commission: {ticket.commission_partenaire_eur}€</>
              )}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium">Client</h4>
            <p>
              <Link href={`/crm/clients/${ticket.client_id}`} className="underline">
                {ticket.prenom} {ticket.nom}
              </Link>
              <br />
              {ticket.email} {ticket.telephone && `• ${ticket.telephone}`}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Entreprise</h4>
            <p>
              <Link href={`/crm/entreprises/${ticket.entreprise_id}`} className="underline">
                {ticket.denomination || `#${ticket.entreprise_id}`}
              </Link>
              <br />
              {ticket.forme}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Partenaire</h4>
            <p>
              <Link href={`/crm/partenaires/${ticket.partenaire_id}`} className="underline">
                {ticket.partenaire_nom}
              </Link>
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex gap-3 pt-2 border-t">
          <label className="flex flex-col text-sm">
            <span className="mb-1">Statut</span>
            <select
              className="border rounded p-2"
              value={ticket.statut}
              onChange={(e) => updateTicket({ statut: e.target.value })}
            >
              {refs.statuts?.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1">Priorité</span>
            <select
              className="border rounded p-2"
              value={ticket.priorite}
              onChange={(e) => updateTicket({ priorite: e.target.value })}
            >
              {refs.priorites?.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1">Assigné à</span>
            <select
              className="border rounded p-2"
              value={ticket.assigne_operateur_id || ""}
              onChange={(e) => updateTicket({ 
                assigne_operateur_id: e.target.value ? parseInt(e.target.value) : null 
              })}
            >
              <option value="">Non assigné</option>
              {operateurs.map(op => (
                <option key={op.id} value={op.id}>{op.nom}</option>
              ))}
            </select>
          </label>
        </div>

        {ticket.operateur_nom && (
          <div className="text-sm text-gray-600 pt-2 border-t">
            Actuellement assigné à: <strong>{ticket.operateur_nom}</strong> ({ticket.operateur_email})
          </div>
        )}
      </section>

      {/* Notes internes équipe */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          📝 Notes internes équipe
          <span className="text-sm font-normal text-gray-600 ml-2">
            (Visible uniquement par les opérateurs)
          </span>
        </h3>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-gray-600">Aucune note pour le moment.</p>
          ) : (
            events.map(event => (
              <div key={event.id} className="border rounded p-3 bg-yellow-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                      👨‍💼 INTERNE
                    </span>
                    <span className="text-sm text-gray-600">
                      {fmt(event.at)}
                    </span>
                  </div>
                  {event.attachments && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      📎 Pièce jointe
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{event.message}</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Ajouter note interne */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          ➕ Ajouter une note interne
          <span className="text-sm font-normal text-gray-600 ml-2">
            (Non visible par le client)
          </span>
        </h3>
        <div className="space-y-3">
          <textarea
            className="w-full border rounded p-3 h-24 bg-yellow-50"
            placeholder="Note interne pour l'équipe (ex: 'Client contacté par téléphone', 'Documents validés', etc.)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sendingMessage}
          />
          <div className="flex gap-2">
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={sendMessage}
              disabled={sendingMessage || !newMessage.trim()}
            >
              {sendingMessage ? "Ajout..." : "📝 Ajouter note interne"}
            </button>
            <button
              className="border px-4 py-2 rounded"
              onClick={() => setNewMessage("")}
              disabled={sendingMessage}
            >
              Effacer
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}