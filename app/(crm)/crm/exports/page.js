"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExportsAdminPage() {
  const [partners, setPartners] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les formulaires d'export
  const [dossiersForm, setDossiersForm] = useState({
    status: "all",
    partnerId: "all", 
    operatorId: "all",
    dateFrom: "",
    dateTo: ""
  });

  const [commissionsForm, setCommissionsForm] = useState({
    partnerId: "all",
    dateFrom: "",
    dateTo: "",
    groupBy: "dossier" // "dossier" | "partner" | "month"
  });

  const [activityForm, setActivityForm] = useState({
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10),
    dateTo: new Date().toISOString().slice(0,10),
    type: "summary" // "summary" | "detailed" | "performance"
  });

  // Charger les données de référence
  useEffect(() => {
    async function loadData() {
      try {
        // On peut récupérer les partenaires et opérateurs depuis le dashboard API
        const r = await fetch("/api/dashboard", { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          setPartners(data.partenaires || []);
          setOperators(data.operateurs || []);
        }
      } catch (e) {
        console.error("Erreur chargement références:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fonctions d'export
  async function exportDossiers() {
    const qs = new URLSearchParams();
    if (dossiersForm.status !== "all") qs.set("status", dossiersForm.status);
    if (dossiersForm.partnerId !== "all") qs.set("partnerId", dossiersForm.partnerId);
    if (dossiersForm.operatorId !== "all") qs.set("operatorId", dossiersForm.operatorId);
    if (dossiersForm.dateFrom) qs.set("from", dossiersForm.dateFrom);
    if (dossiersForm.dateTo) qs.set("to", dossiersForm.dateTo);
    qs.set("format", "csv");

    downloadFile(`/api/exports/dossiers?${qs.toString()}`, `dossiers_${new Date().toISOString().slice(0,10)}.csv`);
  }

  async function exportCommissions() {
    const qs = new URLSearchParams();
    if (commissionsForm.partnerId !== "all") qs.set("partnerId", commissionsForm.partnerId);
    if (commissionsForm.dateFrom) qs.set("from", commissionsForm.dateFrom);
    if (commissionsForm.dateTo) qs.set("to", commissionsForm.dateTo);
    qs.set("groupBy", commissionsForm.groupBy);
    qs.set("format", "csv");

    downloadFile(`/api/exports/commissions?${qs.toString()}`, `commissions_${commissionsForm.groupBy}_${new Date().toISOString().slice(0,10)}.csv`);
  }

  async function exportActivity() {
    const qs = new URLSearchParams();
    if (activityForm.dateFrom) qs.set("from", activityForm.dateFrom);
    if (activityForm.dateTo) qs.set("to", activityForm.dateTo);
    qs.set("type", activityForm.type);
    qs.set("format", "csv");

    downloadFile(`/api/exports/activite?${qs.toString()}`, `rapport_activite_${activityForm.type}_${new Date().toISOString().slice(0,10)}.csv`);
  }

  // Utilitaire de téléchargement
  function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <main className="p-6">Chargement...</main>;

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">📊 Exports & Rapports</h1>
        <Link href="/crm/dashboard" className="text-sm text-blue-600 underline">
          ← Retour dashboard
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* EXPORT DOSSIERS */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📁 Export Dossiers
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Export détaillé des dossiers avec filtres personnalisables.
            Idéal pour analyses et audits.
          </p>

          <div className="space-y-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Statut</span>
              <select 
                className="border rounded p-2"
                value={dossiersForm.status}
                onChange={(e) => setDossiersForm(prev => ({...prev, status: e.target.value}))}
              >
                <option value="all">Tous les statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="en_attente">En attente</option>
                <option value="a_corriger">À corriger</option>
                <option value="valide">Validé</option>
                <option value="rejete">Rejeté</option>
              </select>
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Partenaire</span>
              <select 
                className="border rounded p-2"
                value={dossiersForm.partnerId}
                onChange={(e) => setDossiersForm(prev => ({...prev, partnerId: e.target.value}))}
              >
                <option value="all">Tous les partenaires</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Opérateur</span>
              <select 
                className="border rounded p-2"
                value={dossiersForm.operatorId}
                onChange={(e) => setDossiersForm(prev => ({...prev, operatorId: e.target.value}))}
              >
                <option value="all">Tous les opérateurs</option>
                {operators.map(o => (
                  <option key={o.id} value={o.id}>{o.nom}</option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Du</span>
                <input 
                  type="date" 
                  className="border rounded p-2"
                  value={dossiersForm.dateFrom}
                  onChange={(e) => setDossiersForm(prev => ({...prev, dateFrom: e.target.value}))}
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Au</span>
                <input 
                  type="date" 
                  className="border rounded p-2"
                  value={dossiersForm.dateTo}
                  onChange={(e) => setDossiersForm(prev => ({...prev, dateTo: e.target.value}))}
                />
              </label>
            </div>

            <button 
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={exportDossiers}
            >
              📥 Télécharger CSV Dossiers
            </button>
          </div>
        </section>

        {/* EXPORT COMMISSIONS */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            💰 Export Commissions
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Export des commissions pour facturation partenaires et 
            réconciliation comptable.
          </p>

          <div className="space-y-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Type d'export</span>
              <select 
                className="border rounded p-2"
                value={commissionsForm.groupBy}
                onChange={(e) => setCommissionsForm(prev => ({...prev, groupBy: e.target.value}))}
              >
                <option value="dossier">Par dossier (détaillé)</option>
                <option value="partner">Par partenaire (groupé)</option>
                <option value="month">Par mois (évolution)</option>
              </select>
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Partenaire</span>
              <select 
                className="border rounded p-2"
                value={commissionsForm.partnerId}
                onChange={(e) => setCommissionsForm(prev => ({...prev, partnerId: e.target.value}))}
              >
                <option value="all">Tous les partenaires</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Du</span>
                <input 
                  type="date" 
                  className="border rounded p-2"
                  value={commissionsForm.dateFrom}
                  onChange={(e) => setCommissionsForm(prev => ({...prev, dateFrom: e.target.value}))}
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Au</span>
                <input 
                  type="date" 
                  className="border rounded p-2"
                  value={commissionsForm.dateTo}
                  onChange={(e) => setCommissionsForm(prev => ({...prev, dateTo: e.target.value}))}
                />
              </label>
            </div>

            <button 
              className="w-full bg-green-600 text-white py-2 rounded"
              onClick={exportCommissions}
            >
              💰 Télécharger CSV Commissions
            </button>
          </div>
        </section>

        {/* EXPORT ACTIVITÉ */}
        <section className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📈 Rapport d'Activité
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Rapports de synthèse pour direction : KPIs, performance partenaires,
            évolution activité.
          </p>

          <div className="space-y-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Type de rapport</span>
              <select 
                className="border rounded p-2"
                value={activityForm.type}
                onChange={(e) => setActivityForm(prev => ({...prev, type: e.target.value}))}
              >
                <option value="summary">Synthèse par mois</option>
                <option value="performance">Performance partenaires</option>
                <option value="detailed">Détaillé par dossier</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Du</span>
                <input 
                  type="date" 
                  className="border rounded p-2"
                  value={activityForm.dateFrom}
                  onChange={(e) => setActivityForm(prev => ({...prev, dateFrom: e.target.value}))}
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Au</span>
                <input 
                  type="date" 
                  className="border rounded p-2"
                  value={activityForm.dateTo}
                  onChange={(e) => setActivityForm(prev => ({...prev, dateTo: e.target.value}))}
                />
              </label>
            </div>

            <button 
              className="w-full bg-purple-600 text-white py-2 rounded"
              onClick={exportActivity}
            >
              📈 Télécharger Rapport
            </button>
          </div>
        </section>
      </div>

      {/* Guide d'utilisation */}
      <section className="bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-semibold mb-2">💡 Guide d'utilisation</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium">📁 Export Dossiers</h4>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li>Analyse détaillée par dossier</li>
              <li>Filtrage par statut/partenaire</li>
              <li>Idéal pour audits et suivis</li>
              <li>Compatible Excel/LibreOffice</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">💰 Export Commissions</h4>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li><strong>Par dossier:</strong> Facturation détaillée</li>
              <li><strong>Par partenaire:</strong> Réconciliation</li>
              <li><strong>Par mois:</strong> Évolution CA</li>
              <li>Prêt pour comptabilité</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">📈 Rapport Activité</h4>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li><strong>Synthèse:</strong> KPIs mensuels</li>
              <li><strong>Performance:</strong> Comparaison partenaires</li>
              <li><strong>Détaillé:</strong> Analyse opérationnelle</li>
              <li>Pour rapports direction</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Actions rapides */}
      <section>
        <h3 className="text-lg font-semibold mb-3">⚡ Actions rapides</h3>
        <div className="flex gap-3 flex-wrap">
          <button 
            className="border rounded px-4 py-2 text-sm"
            onClick={() => {
              // Export dossiers du mois
              const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);
              const today = new Date().toISOString().slice(0,10);
              setDossiersForm(prev => ({...prev, dateFrom: startOfMonth, dateTo: today}));
            }}
          >
            📅 Dossiers du mois
          </button>
          <button 
            className="border rounded px-4 py-2 text-sm"
            onClick={() => {
              // Export commissions validées
              setCommissionsForm(prev => ({...prev, groupBy: "partner"}));
            }}
          >
            ✅ Commissions à facturer
          </button>
          <button 
            className="border rounded px-4 py-2 text-sm"
            onClick={() => {
              // Rapport mensuel
              const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);
              const today = new Date().toISOString().slice(0,10);
              setActivityForm(prev => ({...prev, dateFrom: startOfMonth, dateTo: today, type: "summary"}));
            }}
          >
            📊 Rapport mensuel
          </button>
        </div>
      </section>
    </main>
  );
}