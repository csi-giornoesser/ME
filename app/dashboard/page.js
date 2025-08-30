// src/app/dashboard/page.js - Dashboard unifié avec tes vraies fiches
"use client";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import Link from "next/link";

// Import de tes composants existants
import ClientMessaging from "../(crm)/crm/clients/[id]/ClientMessaging";
import DossierTimeline from "../(crm)/crm/clients/[id]/DossierTimeline";
import ClientIdentityCard from "../(crm)/crm/clients/[id]/ClientIdentityCard";
import PiecesJustificativesCard from "../(crm)/crm/clients/[id]/PiecesJustificativesCard";
import DossiersEntrepriseList from "../(crm)/crm/clients/[id]/DossiersEntrepriseList";
import ClientRelancesAlert from "../(crm)/crm/clients/[id]/AlertRelance";
import NotificationsRelancesCard from "../(crm)/crm/clients/[id]/CommsHistory";
import ClientCreateTicket from "../(crm)/crm/clients/[id]/ClientCreateTicket";
import ClientFAQ from "../(crm)/crm/clients/FAQBlock";
import EntrepriseCard from "../(crm)/crm/entreprises/[id]/EntrepriseCard";

import PartnerTracking from "../(crm)/crm/partenaires/[id]/PartnerTracking";

// ✅ AJOUTE CES IMPORTS EN HAUT DU FICHIER (après les imports existants)
// ✅ NOUVEAUX COMPOSANTS MODULAIRES
import PartnerKPIsCard from "../(crm)/crm/partenaires/[id]/PartnerKPIsCard";
import ClientsTableCard from "../(crm)/crm/partenaires/[id]/ClientsTableCard";  
import InvoicesCommissionsCard from "../(crm)/crm/partenaires/[id]/InvoicesCommissionsCard";
import DocumentsLibraryCard from "../(crm)/crm/partenaires/[id]/DocumentsLibraryCard";

// ✅ REMPLACE UNIQUEMENT LA FONCTION PartnerDashboard() PAR CETTE VERSION :
function PartnerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.partnerId) return;
    
    loadPartnerData();
  }, [user?.partnerId]);

  const loadPartnerData = async () => {
    try {
      setLoading(true);
      setErr(null);
      
      const response = await fetch(`/api/partenaires/${user.partnerId}`, { 
        cache: "no-store" 
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erreur chargement partenaire:', error);
      setErr("Erreur chargement partenaire");
    } finally {
      setLoading(false);
    }
  };

  if (err) {
    return (
      <div className="p-6 space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-bold text-red-800 mb-2">Erreur de chargement</h1>
          <p className="text-red-700 mb-4">{err}</p>
          <button 
            onClick={loadPartnerData}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h1 className="text-xl font-bold text-yellow-800 mb-2">Partenaire introuvable</h1>
          <p className="text-yellow-700">
            {data?.error || "Impossible de charger les données du partenaire"}
          </p>
        </div>
      </div>
    );
  }

  // ✅ RÉUTILISE TON CODE EXISTANT DE LA FICHE PARTENAIRE
  const p = data.partenaire || {};
  const ca = data.ca_par_periode || [];
  const factures = data.factures || [];
  const users = data.partner_users || [];
  const dossiers = data.dossiers || [];
  const exportsHist = data.partner_exports_history || [];
  const docs = p.docs || {};

  return (
    <div className="p-6 space-y-6">
      {/* ✅ HEADER PARTENAIRE - Conservé et amélioré */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">🤝 Espace Partenaire</h1>
            <h2 className="text-xl font-semibold mt-1">{p.nom}</h2>
            <p className="text-gray-600">{p.adresse || "—"}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                p.actif !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {p.actif !== false ? '✅ Actif' : '❌ Inactif'}
              </span>
              <span className="text-gray-600">
                <strong>Segment:</strong> {p.segment || "—"}
              </span>
              <span className="text-gray-600">
                <strong>Intégration:</strong> {p.integration || "—"}
              </span>
            </div>
          </div>
          <button 
            onClick={loadPartnerData}
            disabled={loading}
            className="bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* ✅ COMPOSANTS MODULAIRES - Dashboard fonctionnel complet */}
      
      {/* 📊 KPIs & Métriques */}
      <PartnerKPIsCard partnerId={user.partnerId} data={data} />

      {/* 👥 Suivi des clients avec filtres et export */}
      <ClientsTableCard partnerId={user.partnerId} data={data} />

      {/* 💰 Facturation & Commissions */}
      <InvoicesCommissionsCard partnerId={user.partnerId} data={data} />

      {/* 🤝 Suivi commercial - Composant existant */}
      <PartnerTracking partnerId={p.id} />

      {/* 📄 Espace documentaire */}
      <DocumentsLibraryCard partnerId={user.partnerId} data={data} />

      {/* ✅ INFORMATIONS DÉTAILLÉES - Sections repliables (ton ancien contenu) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Informations partenaire */}
        <details className="bg-white border rounded-lg">
          <summary className="cursor-pointer p-4 font-semibold bg-gray-50 rounded-t-lg hover:bg-gray-100">
            📋 Informations détaillées
          </summary>
          <div className="p-4 space-y-3 text-sm">
            <div>
              <strong>Référent:</strong> {p.referent?.nom || "—"} — {p.referent?.email || "—"} — {p.referent?.telephone || "-"}
            </div>
            <div>
              <strong>Intégration:</strong> {p.integration || "-"} — <strong>Facturation:</strong> {p.type_facturation || "-"} — <strong>Commission:</strong> {p.taux_commission ?? "-"}% — <strong>Segment:</strong> {p.segment || "-"}
            </div>
            <div>
              <strong>Contrat:</strong> signé le {p.contrat?.date_signature || "-"} — durée {p.contrat?.duree_mois ?? "-"} mois — statut {p.contrat?.statut || "-"} — {p.contrat?.conditions_commerciales || ""}
            </div>
            <div>
              <strong>Paiement:</strong> {p.paiement?.mode || "-"} — IBAN {p.paiement?.iban || "-"} — BIC {p.paiement?.bic || "-"}
            </div>
            <div>
              <strong>Coord. facturation:</strong> {p.coordonnees_facturation?.societe || "-"} — {p.coordonnees_facturation?.email_facturation || "-"} — {p.coordonnees_facturation?.adresse || "-"}
            </div>
          </div>
        </details>

 
        {/* Dossiers du partenaire (version repliable) */}
        <details className="bg-white border rounded-lg lg:col-span-2">
          <summary className="cursor-pointer p-4 font-semibold bg-gray-50 rounded-t-lg hover:bg-gray-100">
            📂 Dossiers du partenaire ({dossiers.length})
          </summary>
          <div className="p-4">
            {dossiers.length ? (
              <div className="grid gap-2 text-sm max-h-64 overflow-y-auto">
                {dossiers.map(d => (
                  <div key={d.id} className="border-b pb-2">
                    <span className="font-medium">Dossier #{d.id}</span> — statut {d.statut} — client #{d.client_id} — entreprise #{d.entreprise_id}
                    {(d.blocages || []).length ? (
                      <div className="text-red-600 text-xs mt-1">
                        blocages: {(d.blocages || []).join(", ")}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Aucun dossier</p>
            )}
          </div>
        </details>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 py-4 border-t">
        Dashboard partenaire • Dernière actualisation: {new Date().toLocaleString('fr-FR')} • 
        Partenaire #{user.partnerId}
      </div>
    </div>
  );
}

// DASHBOARD CLIENT - TA FICHE CLIENT + ENTREPRISE COMPLÈTE
function ClientDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [entrepriseData, setEntrepriseData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!user?.clientId) return;
    
    // Charger les données client
    fetch(`/api/clients/${user.clientId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(setData)
      .catch(() => setErr("Erreur chargement client"));
  }, [user?.clientId]);

  useEffect(() => {
    if (!data?.dossiers?.[0]?.entreprise_id) return;
    
    // Charger les données entreprise du premier dossier
    const entrepriseId = data.dossiers[0].entreprise_id;
    fetch(`/api/entreprises/${entrepriseId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(setEntrepriseData)
      .catch(() => console.error("Erreur chargement entreprise"));
  }, [data]);

  if (err) return <div className="p-6"><p>{err}</p></div>;
  if (!data) return <div className="p-6">Chargement…</div>;

  // ✅ RÉUTILISE TON CODE EXISTANT DE LA FICHE CLIENT
  const c = data.client;
  const pieces = data.pieces_justificatives || [];
  const zone = data.zone_echange || [];
  const histo = data.historique_echanges || [];
  const dossiers = data.dossiers || [];
  const adr = c.adresse_personnelle || {};
  const adrfis = c.adresse_fiscale || {};
  const downloads = data.telechargements_disponibles || [];

  // Dossier principal (le plus récent)
  const dossierPrincipal = dossiers.length > 0 ? dossiers[0] : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header client */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-green-800">👋 Bonjour {c.prenom} {c.nom}</h1>
        <p className="text-green-700">{c.email} — {c.telephone}</p>
      </div>
      

      <ClientRelancesAlert alert={data.alert_relance} />

      {/* TIMELINE DOSSIER - En première position */}
      {dossierPrincipal && (<DossierTimeline dossier={dossierPrincipal} /> )}

      <NotificationsRelancesCard 
        relances={[]} 
        notifications={data.notifications || []} 
      />

      {/* FICHE ENTREPRISE (composant importé) */}
      {entrepriseData && <EntrepriseCard data={entrepriseData} />}

      {/* Identité & adresses */}
      <ClientIdentityCard client={c} />

      {/* Pièces justificatives */}
      <PiecesJustificativesCard
        pieces={pieces}
        downloads={downloads}
        // optionnel : activer la checklist requise quand tu veux
        requiredTypes={["Passeport", "PhotoIdentite", "RIB", "CNI"]}
      />

      {/* MESSAGERIE CLIENT - Ton composant existant avec prop */}
      <ClientMessaging clientId={c.id} dossiers={dossiers} senderType="Client" />

      {/* 🆘 Création de ticket par le client */}
      <ClientCreateTicket
        clientId={c.id}
        dossiers={dossiers}
        onCreated={() => {
          // Optionnel : rafraîchir une liste de tickets ou l’historique
          // ex: refetch("/api/clients/${c.id}/tickets") si tu l’affiches
        }}
      />

      <ClientFAQ entries={data.faq} />

    </div>
  );
}

// DASHBOARD CRM - Redirection vers ton CRM existant
function CRMDashboard() {
  useEffect(() => {
    // Rediriger vers ton CRM existant
    window.location.href = '/crm/dashboard';
  }, []);

  return (
    <div className="text-center py-8">
      <p>Redirection vers le CRM...</p>
      <Link href="/crm/dashboard" className="text-blue-600 underline">
        Ou cliquer ici pour aller au CRM
      </Link>
    </div>
  );
}

// DASHBOARD UNIFIÉ PRINCIPAL
export default function UnifiedDashboard() {
  const { user, switchRole } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Erreur: Utilisateur non défini</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bureau Des Formalités</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Connecté: <strong>{user.name}</strong> ({user.role})
              <div className="text-xs">{user.email}</div>
            </div>
            
            {/* Info pour changer de personne */}
            <div className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded">
              💡 Pour changer: modifie hooks/useAuth.js
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b px-6 py-2">
        <div className="flex gap-4 text-sm">
          <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
          
          {user.role === 'operator' && (
            <>
              <Link href="/crm/dashboard" className="text-gray-600 hover:text-blue-600">CRM Complet</Link>
              <Link href="/crm/tickets" className="text-gray-600 hover:text-blue-600">Tickets</Link>
              <Link href="/crm/commercial" className="text-gray-600 hover:text-blue-600">Commercial</Link>
            </>
          )}
          
          {user.role === 'partner' && (
            <>
              <Link href="/factures" className="text-gray-600 hover:text-blue-600">Factures</Link>
              <Link href="/exports" className="text-gray-600 hover:text-blue-600">Exports</Link>
            </>
          )}
          
          {user.role === 'client' && (
            <>
              <Link href="/documents" className="text-gray-600 hover:text-blue-600">Documents</Link>
              <Link href="/aide" className="text-gray-600 hover:text-blue-600">Aide</Link>
            </>
          )}
        </div>
      </nav>

      {/* Contenu principal */}
      <main>
        {user.role === 'operator' && <CRMDashboard />}
        {user.role === 'partner' && <PartnerDashboard />}
        {user.role === 'client' && <ClientDashboard />}
      </main>
    </div>
  );
}