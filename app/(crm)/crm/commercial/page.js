"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const fmt = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "-";

export default function CommercialDashboard() {
  const [rappels, setRappels] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRappels();
  }, []);

  async function loadRappels() {
    setLoading(true);
    try {
      const r = await fetch("/api/commercial/rappels", { cache: "no-store" });
      if (r.ok) {
        const data = await r.json();
        setRappels(data.rappels || []);
        setStats(data.stats || {});
      }
    } catch (e) {
      console.error("Erreur chargement rappels:", e);
    } finally {
      setLoading(false);
    }
  }

  const getUrgenceColor = (rappel) => {
    if (!rappel.rappel_date) return 'border-l-gray-500 bg-gray-50';
    
    const today = new Date();
    const rappelDate = new Date(rappel.rappel_date);
    const diffDays = Math.ceil((rappelDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'border-l-red-500 bg-red-50'; // En retard
    if (diffDays === 0) return 'border-l-orange-500 bg-orange-50'; // Aujourd'hui
    if (diffDays <= 3) return 'border-l-yellow-500 bg-yellow-50'; // Cette semaine
    return 'border-l-blue-500 bg-blue-50'; // Plus tard
  };

  const getUrgenceLabel = (rappel) => {
    if (!rappel.rappel_date) return '📅 Sans échéance';
    
    const today = new Date();
    const rappelDate = new Date(rappel.rappel_date);
    const diffDays = Math.ceil((rappelDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `🔴 En retard (${Math.abs(diffDays)}j)`;
    if (diffDays === 0) return '🟡 Aujourd\'hui';
    if (diffDays === 1) return '🟡 Demain';
    if (diffDays <= 7) return `🔵 Dans ${diffDays} jours`;
    return `⚪ Dans ${diffDays} jours`;
  };

  const groupedRappels = rappels.reduce((acc, rappel) => {
    const urgence = getUrgenceLabel(rappel);
    if (!acc[urgence]) acc[urgence] = [];
    acc[urgence].push(rappel);
    return acc;
  }, {});

  if (loading) return <main className="p-6">Chargement du dashboard commercial...</main>;

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">🤝 Dashboard Commercial</h1>
        <Link href="/crm/dashboard" className="text-sm text-blue-600 underline">
          ← Retour dashboard
        </Link>
      </div>

      {/* Stats rapides */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="text-2xl font-bold text-red-600">{stats.en_retard || 0}</div>
          <div className="text-sm text-gray-600">Rappels en retard</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.aujourd_hui || 0}</div>
          <div className="text-sm text-gray-600">À faire aujourd'hui</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.cette_semaine || 0}</div>
          <div className="text-sm text-gray-600">Cette semaine</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.total || 0}</div>
          <div className="text-sm text-gray-600">Total actions</div>
        </div>
      </div>

      {/* Rappels par urgence */}
      {Object.keys(groupedRappels).length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Aucune action commerciale en attente !
          </h3>
          <p className="text-green-600">
            Toutes les actions de suivi partenaires sont à jour.
          </p>
        </div>
      ) : (
        Object.entries(groupedRappels).map(([urgence, rappelsGroup]) => (
          <section key={urgence}>
            <h2 className="text-xl font-semibold mb-3">{urgence}</h2>
            <div className="space-y-3">
              {rappelsGroup.map(rappel => (
                <div 
                  key={rappel.id} 
                  className={`border-l-4 p-4 rounded ${getUrgenceColor(rappel)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link 
                          href={`/partenaires/${rappel.partner_id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {rappel.partner_nom}
                        </Link>
                        <span className="text-sm bg-white px-2 py-1 rounded border">
                          {rappel.type_interaction}
                        </span>
                      </div>
                      
                      <h4 className="font-medium mb-1">{rappel.sujet}</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Action à faire :</strong> {rappel.prochaine_action}
                      </p>
                      
                      {rappel.notes && (
                        <p className="text-sm text-gray-600 bg-white p-2 rounded">
                          {rappel.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                      <div>Interaction: {fmt(rappel.date_interaction)}</div>
                      {rappel.rappel_date && (
                        <div className="font-medium">Rappel: {fmt(rappel.rappel_date)}</div>
                      )}
                      <div>Par: {rappel.created_by}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/partenaires/${rappel.partner_id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      📞 Voir partenaire
                    </Link>
                    <button className="border px-3 py-1 rounded text-sm">
                      ✅ Marquer fait
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {/* Actions rapides */}
      <section className="bg-gray-50 rounded p-4">
        <h3 className="font-semibold mb-3">⚡ Actions rapides</h3>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={loadRappels}
            className="border rounded px-4 py-2 text-sm"
          >
            🔄 Actualiser
          </button>
          <Link 
            href="/crm/exports?export=commercial"
            className="border rounded px-4 py-2 text-sm underline"
          >
            📊 Export rappels
          </Link>
          <Link 
            href="/crm/partenaires"
            className="border rounded px-4 py-2 text-sm underline"
          >
            👥 Tous les partenaires
          </Link>
        </div>
      </section>
    </main>
  );
}