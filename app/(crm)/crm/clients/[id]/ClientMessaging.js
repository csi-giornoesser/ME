"use client";
import { useEffect, useState } from "react";

const fmt = (d) => d ? new Date(d).toLocaleString("fr-FR") : "-";

export default function ClientMessaging({ clientId, dossiers, senderType = "Opérateur" }) {
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  // Détermine qui envoie le message
  const isClientSending = senderType === "Client";
  const isOperatorSending = senderType === "Opérateur";

  // Sélectionner le premier dossier par défaut
  useEffect(() => {
    if (dossiers.length > 0 && !selectedDossier) {
      setSelectedDossier(dossiers[0]);
    }
  }, [dossiers, selectedDossier]);

  // Charger messages du dossier sélectionné
  useEffect(() => {
    if (!selectedDossier) return;
    
    setLoading(true);
    fetch(`/api/dossiers/${selectedDossier.id}/messages`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => setMessages(data.messages || []))
      .catch(e => {
        console.error("Erreur chargement messages:", e);
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, [selectedDossier]);

  // Envoyer nouveau message (adapté selon le sender)
  async function sendMessage() {
    if (!newMessage.trim() || !selectedDossier) return;
    
    setSending(true);
    try {
      const r = await fetch(`/api/dossiers/${selectedDossier.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_type: senderType, // 🔥 Utilise la prop
          body: newMessage.trim(),
          send_email: isOperatorSending // Email seulement si opérateur envoie
        })
      });
      
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      
      const data = await r.json();
      
      // Recharger les messages
      setMessages(prev => [...prev, data.message]);
      setNewMessage("");
      
      // Alerte différente selon qui envoie
      if (isOperatorSending && data.email_sent) {
        alert(`Message envoyé et email automatique expédié à ${data.client_email}`);
      } else if (isClientSending) {
        alert("Message envoyé à l'équipe !");
      }
    } catch (e) {
      console.error("Erreur envoi message:", e);
      alert("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  }

  const getSenderColor = (senderType) => {
    switch (senderType) {
      case "Client": return "bg-blue-50 border-l-4 border-l-blue-500";
      case "Opérateur": return "bg-green-50 border-l-4 border-l-green-500";
      case "Système": return "bg-gray-50 border-l-4 border-l-gray-500";
      default: return "bg-gray-50";
    }
  };

  const getSenderIcon = (senderType) => {
    switch (senderType) {
      case "Client": return "👤";
      case "Opérateur": return "👨‍💼";
      case "Système": return "🤖";
      default: return "💬";
    }
  };

  // Affichage du nom de l'expéditeur selon le contexte
  const getSenderDisplayName = (msgSenderType) => {
    if (isClientSending) {
      // Vue client : "Vous" pour ses messages, "Équipe" pour les opérateurs
      return msgSenderType === "Client" ? "Vous" : 
             msgSenderType === "Opérateur" ? "Équipe" : 
             msgSenderType;
    } else {
      // Vue opérateur : noms normaux
      return msgSenderType;
    }
  };

  if (dossiers.length === 0) {
    return (
      <section className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-3">💬 Messagerie</h3>
        <p className="text-gray-600">Aucun dossier trouvé{isClientSending ? "" : " pour ce client"}.</p>
      </section>
    );
  }

  return (
    <section className="border rounded p-4 space-y-4">
      <h3 className="text-lg font-semibold">
        💬 {isClientSending ? "Messagerie avec votre équipe" : "Messagerie Client"}
        <span className="text-sm font-normal text-gray-600 ml-2">
          {isClientSending 
            ? "(Communication avec nos opérateurs)" 
            : "(Communication directe avec le client)"
          }
        </span>
      </h3>

      {/* Sélecteur de dossier */}
      {dossiers.length > 1 && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Dossier à afficher :
          </label>
          <select
            className="border rounded p-2"
            value={selectedDossier?.id || ""}
            onChange={(e) => {
              const dossier = dossiers.find(d => d.id === parseInt(e.target.value));
              setSelectedDossier(dossier);
            }}
          >
            {dossiers.map(d => (
              <option key={d.id} value={d.id}>
                Dossier #{d.id} - {d.statut}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDossier && (
        <>
          <div className="text-sm bg-blue-50 p-2 rounded">
            📁 <strong>Dossier #{selectedDossier.id}</strong> - Statut: {selectedDossier.statut}
          </div>

          {/* Messages */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-gray-600">Chargement des messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-gray-600">Aucun message pour ce dossier.</p>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`p-3 rounded ${getSenderColor(msg.sender_type)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{getSenderIcon(msg.sender_type)}</span>
                      <strong className="text-sm">
                        {getSenderDisplayName(msg.sender_type)}
                      </strong>
                    </div>
                    <span className="text-xs text-gray-600">
                      {fmt(msg.at)}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.body}</div>
                </div>
              ))
            )}
          </div>

          {/* Nouveau message */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium">
              {isClientSending ? "✉️ Envoyer un message à l'équipe" : "✉️ Répondre au client"}
            </h4>
            <textarea
              className="w-full border rounded p-3 h-24"
              placeholder={isClientSending 
                ? "Votre message à l'équipe..." 
                : "Votre message sera envoyé au client par email..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
              >
                {sending ? "Envoi..." : 
                 isClientSending ? "📤 Envoyer à l'équipe" : "📧 Envoyer au client"}
              </button>
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setNewMessage("")}
                disabled={sending}
              >
                Effacer
              </button>
            </div>
            <p className="text-xs text-gray-600">
              💡 {isClientSending 
                ? "Votre message sera envoyé à l'équipe et ajouté à l'historique de votre dossier." 
                : "Le message sera ajouté à l'historique et envoyé automatiquement par email au client."
              }
            </p>
          </div>
        </>
      )}
    </section>
  );
}