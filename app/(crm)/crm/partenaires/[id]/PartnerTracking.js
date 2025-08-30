"use client";
import { useEffect, useState } from "react";

const fmt = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "-";
const fmtDateTime = (d) => d ? new Date(d).toLocaleString("fr-FR") : "-";

export default function PartnerTracking({ partnerId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Formulaire nouvelle interaction
  const [form, setForm] = useState({
    type_interaction: 'appel',
    direction: 'sortant',
    sujet: '',
    notes: '',
    participant: '',
    duree_minutes: '',
    prochaine_action: '',
    rappel_date: ''
  });

  useEffect(() => {
    if (partnerId) {
      loadData();
    }
  }, [partnerId]);

  async function loadData() {
    setLoading(true);
    try {
      const r = await fetch(`/api/partenaires/${partnerId}/interactions`, { cache: "no-store" });
      if (r.ok) {
        const json = await r.json();
        setData(json);
      }
    } catch (e) {
      console.error("Erreur chargement interactions:", e);
    } finally {
      setLoading(false);
    }
  }

  async function addInteraction() {
    if (!form.sujet.trim()) {
      alert("Sujet requis");
      return;
    }

    setAdding(true);
    try {
      const r = await fetch(`/api/partenaires/${partnerId}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (r.ok) {
        await loadData();
        setForm({
          type_interaction: 'appel',
          direction: 'sortant',
          sujet: '',
          notes: '',
          participant: '',
          duree_minutes: '',
          prochaine_action: '',
          rappel_date: ''
        });
        setShowForm(false);
      } else {
        throw new Error("Erreur création");
      }
    } catch (e) {
      console.error("Erreur ajout interaction:", e);
      alert("Erreur lors de l'ajout");
    } finally {
      setAdding(false);
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'appel': return '📞';
      case 'email': return '✉️';
      case 'reunion': return '🤝';
      case 'relance': return '📋';
      case 'note': return '📝';
      default: return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'appel': return 'bg-blue-50 border-l-blue-500';
      case 'email': return 'bg-green-50 border-l-green-500';
      case 'reunion': return 'bg-purple-50 border-l-purple-500';
      case 'relance': return 'bg-orange-50 border-l-orange-500';
      case 'note': return 'bg-gray-50 border-l-gray-500';
      default: return 'bg-gray-50 border-l-gray-500';
    }
  };

  if (!partnerId) {
    return null;
  }

  if (loading) {
    return (
      <section className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-3">🤝 Suivi Commercial</h3>
        <p className="text-gray-600">Chargement...</p>
      </section>
    );
  }

  const interactions = data?.interactions || [];
  const prochaines = data?.prochaines_actions || [];
  const stats = data?.stats || {};
  const types = data?.references?.types || [];
  const directions = data?.references?.directions || [];
  const suggestedContacts = data?.suggested_contacts || [];

  // Fonction pour sélectionner un contact suggéré
  const selectContact = (contact) => {
    setForm(prev => ({
      ...prev,
      participant: contact.nom
    }));
  };

  return (
    <section className="border rounded p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🤝 Suivi Commercial</h3>
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Annuler" : "+ Nouvelle interaction"}
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 p-3 rounded text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total_interactions || 0}</div>
          <div className="text-xs text-gray-600">Total interactions</div>
        </div>
        <div className="bg-green-50 p-3 rounded text-center">
          <div className="text-2xl font-bold text-green-600">{stats.interactions_30j || 0}</div>
          <div className="text-xs text-gray-600">Ce mois</div>
        </div>
        <div className="bg-purple-50 p-3 rounded text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.nb_reunions || 0}</div>
          <div className="text-xs text-gray-600">Réunions</div>
        </div>
        <div className="bg-orange-50 p-3 rounded text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.actions_en_attente || 0}</div>
          <div className="text-xs text-gray-600">Actions en attente</div>
        </div>
      </div>

      {/* Prochaines actions */}
      {prochaines.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <h4 className="font-medium text-yellow-800 mb-2">⏰ Prochaines actions</h4>
          <div className="space-y-1">
            {prochaines.map(action => (
              <div key={action.id} className="text-sm">
                <span className="font-medium">{action.prochaine_action}</span>
                {action.rappel_date && (
                  <span className="text-yellow-700 ml-2">
                    (Rappel: {fmt(action.rappel_date)})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire nouvelle interaction */}
      {showForm && (
        <div className="border rounded p-4 bg-gray-50">
          <h4 className="font-medium mb-3">Nouvelle interaction</h4>
          
          <div className="grid md:grid-cols-2 gap-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Type *</span>
              <select
                className="border rounded p-2"
                value={form.type_interaction}
                onChange={(e) => setForm(prev => ({...prev, type_interaction: e.target.value}))}
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Direction</span>
              <select
                className="border rounded p-2"
                value={form.direction}
                onChange={(e) => setForm(prev => ({...prev, direction: e.target.value}))}
              >
                {directions.map(dir => (
                  <option key={dir.value} value={dir.value}>{dir.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-sm md:col-span-2">
              <span className="mb-1 font-medium">Sujet *</span>
              <input
                type="text"
                className="border rounded p-2"
                value={form.sujet}
                onChange={(e) => setForm(prev => ({...prev, sujet: e.target.value}))}
                placeholder="Ex: Suivi mensuel performance"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Participant</span>
              
              {/* Contacts suggérés */}
              {suggestedContacts.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-600 mb-1">Contacts suggérés :</div>
                  <div className="flex flex-wrap gap-1">
                    {suggestedContacts.map((contact, i) => (
                      <button
                        key={i}
                        type="button"
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        onClick={() => selectContact(contact)}
                      >
                        {contact.nom}
                        {contact.type === 'Référent principal' && ' 👑'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Champ de saisie */}
              <input
                type="text"
                className="border rounded p-2"
                value={form.participant}
                onChange={(e) => setForm(prev => ({...prev, participant: e.target.value}))}
                placeholder="Nom du contact ou sélectionnez ci-dessus"
                list="contacts-datalist"
              />
              
              {/* Datalist pour autocomplétion */}
              <datalist id="contacts-datalist">
                {suggestedContacts.map((contact, i) => (
                  <option key={i} value={contact.nom}>
                    {contact.display}
                  </option>
                ))}
              </datalist>
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Durée (minutes)</span>
              <input
                type="number"
                className="border rounded p-2"
                value={form.duree_minutes}
                onChange={(e) => setForm(prev => ({...prev, duree_minutes: e.target.value}))}
                placeholder="30"
              />
            </label>

            <label className="flex flex-col text-sm md:col-span-2">
              <span className="mb-1 font-medium">Notes</span>
              <textarea
                className="border rounded p-2 h-20"
                value={form.notes}
                onChange={(e) => setForm(prev => ({...prev, notes: e.target.value}))}
                placeholder="Détails de l'interaction..."
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Prochaine action</span>
              <input
                type="text"
                className="border rounded p-2"
                value={form.prochaine_action}
                onChange={(e) => setForm(prev => ({...prev, prochaine_action: e.target.value}))}
                placeholder="Ex: Programmer réunion bilan"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Rappel le</span>
              <input
                type="date"
                className="border rounded p-2"
                value={form.rappel_date}
                onChange={(e) => setForm(prev => ({...prev, rappel_date: e.target.value}))}
              />
            </label>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={addInteraction}
              disabled={adding || !form.sujet.trim()}
            >
              {adding ? "Ajout..." : "✅ Ajouter"}
            </button>
            <button
              className="border px-4 py-2 rounded"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des interactions */}
      <div>
        <h4 className="font-medium mb-3">Historique des interactions</h4>
        
        {interactions.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            Aucune interaction enregistrée. Ajoutez la première !
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {interactions.map(interaction => (
              <div 
                key={interaction.id} 
                className={`border-l-4 p-3 rounded ${getTypeColor(interaction.type_interaction)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getTypeIcon(interaction.type_interaction)}</span>
                    <div>
                      <h5 className="font-medium">{interaction.sujet}</h5>
                      <div className="text-sm text-gray-600">
                        {interaction.type_interaction} {interaction.direction} 
                        {interaction.participant && (
                          <>
                            {" avec "}
                            <span className="font-medium">{interaction.participant}</span>
                            {/* Indiquer si c'est un contact connu */}
                            {suggestedContacts.find(c => c.nom === interaction.participant) && (
                              <span className="text-xs bg-green-100 text-green-700 px-1 rounded ml-1">
                                {suggestedContacts.find(c => c.nom === interaction.participant)?.type === 'Référent principal' ? '👑' : '✓'}
                              </span>
                            )}
                          </>
                        )}
                        {interaction.duree_minutes && ` (${interaction.duree_minutes}min)`}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {fmtDateTime(interaction.date_interaction)}
                  </span>
                </div>

                {interaction.notes && (
                  <div className="text-sm mt-2 bg-white p-2 rounded">
                    {interaction.notes}
                  </div>
                )}

                {interaction.prochaine_action && (
                  <div className="text-sm mt-2 text-orange-700 bg-orange-100 p-2 rounded">
                    <strong>→ Prochaine action:</strong> {interaction.prochaine_action}
                    {interaction.rappel_date && (
                      <span className="ml-2">(Rappel: {fmt(interaction.rappel_date)})</span>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">
                  Par {interaction.created_by}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {stats.derniere_interaction && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Dernière interaction: {fmtDateTime(stats.derniere_interaction)}
        </div>
      )}
    </section>
  );
}