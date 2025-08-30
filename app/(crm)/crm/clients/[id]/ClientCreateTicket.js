"use client";
import { useState, useMemo } from "react";

export default function ClientCreateTicket({ clientId, dossiers = [], onCreated }) {
  const [dossierId, setDossierId] = useState(() =>
    dossiers?.[0]?.id ? String(dossiers[0].id) : ""
  );
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Moyenne");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const canSubmit = useMemo(() => {
    const result = !!dossierId && subject.trim().length > 2 && message.trim().length > 5;
    console.log('canSubmit:', result, { dossierId, subjectLength: subject.trim().length, messageLength: message.trim().length });
    return result;
  }, [dossierId, subject, message]);

  async function handleSubmit(e) {
    console.log('handleSubmit called');
    e.preventDefault();
    
    if (!canSubmit || loading) {
      console.log('Submit blocked:', { canSubmit, loading });
      return;
    }

    const payload = {
      client_id: clientId,
      dossier_id: Number(dossierId),
      subject: subject.trim(),
      priorite: priority,
      message: message.trim(),
      sender_type: "Client",
      source: `client_manual_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ouverture: "manuelle"
    };
    
    console.log('Sending payload:', payload);

    setErr(null);
    setOk(null);
    setLoading(true);
    
    try {
      const r = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log('Response status:', r.status);
      console.log('Response headers:', Object.fromEntries(r.headers.entries()));
      
      const j = await r.json().catch((parseError) => {
        console.error('JSON parse error:', parseError);
        return {};
      });
      
      console.log('Response body:', j);
      
      if (!r.ok) {
        if (r.status === 409) {
          throw new Error("Un ticket similaire existe déjà. Veuillez rafraîchir la page.");
        }
        throw new Error(j.error || `HTTP ${r.status}`);
      }

      setOk("Votre ticket a bien été créé ✅");
      setSubject("");
      setMessage("");
      if (typeof onCreated === "function") onCreated(j);
      
    } catch (e) {
      console.error('Submit error:', e);
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // Debug info
  console.log('Component render:', { clientId, dossiersCount: dossiers.length, canSubmit, loading });

  return (
    <section className="border rounded p-4 space-y-3">
      <h3 className="font-semibold text-lg">🆘 Ouvrir un ticket d'assistance</h3>
      
      {/* Debug info */}
      <div className="text-xs bg-gray-100 p-2 rounded">
        <div>clientId: {clientId}</div>
        <div>dossierId: {dossierId}</div>
        <div>canSubmit: {canSubmit ? 'true' : 'false'}</div>
        <div>loading: {loading ? 'true' : 'false'}</div>
      </div>

      {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-2 rounded">❌ {err}</div>}
      {ok && <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-2 rounded">{ok}</div>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Dossier concerné</span>
          <select
            className="border rounded p-2"
            value={dossierId}
            onChange={(e) => setDossierId(e.target.value)}
            required
          >
            <option value="" disabled>— Sélectionner —</option>
            {dossiers.map((d) => (
              <option key={d.id} value={String(d.id)}>
                #{d.id} — {d.statut ?? "—"} — créé le {new Date(d.date_creation).toLocaleDateString("fr-FR")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Objet</span>
          <input
            className="border rounded p-2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex : Problème d'upload de pièce"
            required
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Priorité</span>
          <select
            className="border rounded p-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Basse</option>
            <option>Moyenne</option>
            <option>Haute</option>
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Message</span>
          <textarea
            className="border rounded p-2 min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrivez votre demande…"
            required
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-50"
            onClick={(e) => console.log('Button clicked', { canSubmit, loading })}
          >
            {loading ? "Envoi…" : "Créer le ticket"}
          </button>
          <span className="text-xs text-gray-500 self-center">
            Vous recevrez une notification dès qu'un conseiller répond.
          </span>
        </div>
      </form>
    </section>
  );
}