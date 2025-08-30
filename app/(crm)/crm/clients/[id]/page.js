// src/app/(crm)/crm/clients/[id]/page.js
"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

// Blocs réutilisés
import DossierTimeline from "./DossierTimeline";
import ClientIdentityCard from "./ClientIdentityCard";
import PiecesJustificativesCard from "./PiecesJustificativesCard";
import DossiersEntrepriseList from "./DossiersEntrepriseList";
import CommsHistory from "./CommsHistory";

// Cartes importées
import ClientsTableCard from "../../partenaires/[id]/ClientsTableCard";
import EntrepriseCard from "../../entreprises/[id]/EntrepriseCard";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

export default function CRMClientPage() {
  // ✅ HOOKS: toujours en haut, jamais après un return conditionnel
  const { id } = useParams();
  const search = useSearchParams();

  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [entrepriseData, setEntrepriseData] = useState(null);

  // Charger /api/clients/[id]
  useEffect(() => {
    let cancelled = false;
    setData(null);
    setErr(null);
    (async () => {
      try {
        const r = await fetch(`/api/clients/${id}`, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setErr("Erreur chargement client");
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Dérivés sûrs même quand data est null
  const dossierParam = search?.get("dossier") || null;
  const dossiers = data?.dossiers ?? [];
  const entrepriseLite = data?.entreprise ?? null;
  const client = data?.client ?? null;

  // Dossier principal (stable)
  const dossierPrincipal = useMemo(() => {
    if (!dossiers.length) return null;
    if (dossierParam) return dossiers.find(d => String(d.id) === String(dossierParam)) || dossiers[0];
    return dossiers[0];
  }, [dossiers, dossierParam]);

  // Charger la fiche entreprise complète si besoin (pour EntrepriseCard)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!dossierPrincipal?.entreprise_id) { setEntrepriseData(null); return; }
      try {
        const r = await fetch(`/api/entreprises/${dossierPrincipal.entreprise_id}`, { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        if (!cancelled) setEntrepriseData(json);
      } catch {
        // silencieux
      }
    })();
    return () => { cancelled = true; };
  }, [dossierPrincipal?.entreprise_id]);

  // 👥 Alimente ClientsTableCard avec UNE ligne (ce client)
  const clientsOne = useMemo(() => {
    if (!client || !dossierPrincipal) return [];
    const e = entrepriseLite || {};
    return [{
      id: client.id,
      dossier_id: dossierPrincipal.id,
      entreprise_id: dossierPrincipal.entreprise_id,
      fullName: `${client.prenom || ""} ${client.nom || ""}`.trim() || `Client #${client.id}`,
      email: client.email || "",
      telephone: client.telephone || "",
      entreprise_nom: e.denomination || `Entreprise #${dossierPrincipal.entreprise_id}`,
      entreprise_forme: e.forme || "Micro-entrepreneur",
      statut: dossierPrincipal.statut,
      date_creation: dossierPrincipal.date_creation,
      date_creation_effective:
        e?.dates?.date_immatriculation_reelle || e?.dates?.date_debut_activite || null,
      derniere_modification: dossierPrincipal.derniere_modification || null,
      blocages: dossierPrincipal.blocages || [],
      commission_partenaire_eur: dossierPrincipal.commission_partenaire_eur || 0,
    }];
  }, [client, dossierPrincipal, entrepriseLite]);

  // ✅ Après TOUS les hooks, on peut retourner conditionnellement
  if (err) {
    return (
      <main className="p-6 space-y-3">
        <Link href="/crm/dashboard" className="text-blue-600 underline">← Retour dashboard</Link>
        <h1 className="text-xl font-bold">Erreur</h1>
        <pre className="bg-gray-100 p-3 rounded text-sm">{err}</pre>
      </main>
    );
  }
  if (!data) return <main className="p-6">Chargement…</main>;

  const pieces = data.pieces_justificatives || [];
  const downloads = data.telechargements_disponibles || [];
  const comms = data.communications || [];
  const relances = data.relances || [];
  const notifications = data?.notifications || [];  // ← Enlever "_queue"


  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/crm/dashboard" className="text-blue-600 underline">← Retour dashboard</Link>
        <div className="text-sm text-gray-600">
          Client #{client?.id} • créé le {fmt(client?.created_at)}
        </div>
      </div>

      {/* 👥 Suivi des clients (1) */}
      <section>
        <ClientsTableCard partnerId={null} data={{ clients: clientsOne }} />
      </section>

      {/* 📨 Historique (relances & notifications) */}
      <section>
      <h3 className="text-lg font-semibold mb-3">
        📨 Historique (relances & notifications)
      </h3>
      
      <CommsHistory
        relances={[]} 
        notifications={data?.notifications || []}
      />
      </section>
      

      {/* 🏷️ Timeline du dossier principal */}
      {dossierPrincipal && (
        <section id="timeline">
          <DossierTimeline dossier={dossierPrincipal} />
        </section>
      )}

      {/* 🏢 Mon entreprise */}
      {entrepriseData ? (
        <EntrepriseCard data={entrepriseData} />
      ) : entrepriseLite ? (
        <section className="border rounded p-4">
          <h3 className="text-lg font-semibold">🏢 Mon entreprise</h3>
          <div className="text-sm text-gray-700">
            <div><b>{entrepriseLite.denomination || "—"}</b> — {entrepriseLite.forme || "Micro-entrepreneur"}</div>
            <div>Statut dossier: {entrepriseLite.statut_dossier || "—"}</div>
            <Link className="underline" href={`/crm/entreprises/${entrepriseLite.id}`}>Voir la fiche →</Link>
          </div>
        </section>
      ) : null}

      {/* 🆔 Identité & adresses */}
      <section>
        <h3 className="text-lg font-semibold mb-3">🆔 Identité & adresses</h3>
        <ClientIdentityCard client={client} />
      </section>

      {/* 📄 Pièces justificatives */}
      <section>
        <h3 className="text-lg font-semibold mb-3">📄 Pièces justificatives</h3>
        <PiecesJustificativesCard
          pieces={pieces}
          downloads={downloads}
          requiredTypes={["Passeport", "PhotoIdentite", "RIB", "CNI"]}
        />
      </section>

      {/* 📂 Dossiers & entreprise */}
      <section>
        <h3 className="text-lg font-semibold mb-3">📂 Dossiers & entreprise</h3>
        <DossiersEntrepriseList
          dossiers={dossiers}
          dossierPrincipalId={dossierPrincipal?.id}
        />
      </section>
    </main>
  );
}
