"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "-");

export default function EntreprisePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setErr(null);
    fetch(`/api/entreprises/${id}`, { cache: "no-store", signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText} — ${await r.text().catch(()=> "")}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => { if (!ctrl.signal.aborted) setErr(String(e)); })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    return () => ctrl.abort();
  }, [id]);

  if (loading) return <main className="p-6">Chargement…</main>;
  if (err) return (
    <main className="p-6 space-y-2">
      <Link href="/crm/dashboard">← Retour</Link>
      <h1 className="text-xl font-bold mt-2">Erreur</h1>
      <pre className="text-sm bg-gray-100 p-3 rounded">{err}</pre>
    </main>
  );
  if (!data?.entreprise || data.error) return (
    <main className="p-6">
      <Link href="/crm/dashboard">← Retour</Link>
      <h1 className="text-xl font-bold mt-2">Entreprise introuvable</h1>
    </main>
  );

  const e = data.entreprise;
  const docs = data.documents_generes ?? [];
  const jobs = data.scraping_jobs ?? [];
  const dossiers = data.dossiers ?? [];
  const INPI = e.donnees_gouvernement?.guichet_unique_INPI ?? {};
  const INSEE = e.donnees_gouvernement?.INSEE_SIRENE ?? {};
  const URSSAF = e.donnees_gouvernement?.URSSAF ?? {};
  const RNE = e.donnees_gouvernement?.RNE ?? {};
  const TVA = e.options_fiscales ?? {};
  const check = e.checklist_conformite ?? {};
  const paiement = e.service_paiement ?? {};
  const titulaire = e.titulaire_client;

  return (
    <main className="p-6 space-y-6">
      <Link href="/crm/dashboard">← Retour</Link>
      <h1 className="text-2xl font-bold">Entreprise #{e.id} — {e.denomination}</h1>
      <p>Forme: {e.forme} — Statut: {e.statut_dossier}</p>
      <p>
        Titulaire: {titulaire
          ? <Link className="underline" href={`/crm/dashboard/clients/${titulaire.id}`}>{titulaire.prenom} {titulaire.nom}</Link>
          : "—"}
      </p>

      {/* Activité & lieu */}
      <section>
        <h3 className="text-lg font-semibold">Activité & lieu</h3>
        <ul className="list-disc pl-6">
          <li>Activité: {e.activite?.description || "-"}</li>
          <li>Catégorie: {e.activite?.categorie || "-"} — APE/NAF: {e.activite?.APE_NAF || "-"}</li>
          <li>Réglem.: {e.activite?.profession_reglementee ? "Oui" : "Non"}</li>
          <li>
            Établissement: {e.lieu_exercice?.adresse_etablissement?.ligne1 || "-"},{" "}
            {e.lieu_exercice?.adresse_etablissement?.code_postal || ""}{" "}
            {e.lieu_exercice?.adresse_etablissement?.ville || ""}
          </li>
        </ul>
      </section>

      {/* Dates */}
      <section>
        <h3 className="text-lg font-semibold">Dates</h3>
        <ul className="list-disc pl-6">
          <li>Demande: {fmt(e.dates?.date_demande)}</li>
          <li>Début d’activité: {fmt(e.dates?.date_debut_activite)}</li>
          <li>Immatriculation réelle: {fmt(e.dates?.date_immatriculation_reelle)}</li>
        </ul>
      </section>

      {/* Options sociales & fiscales */}
      <section>
        <h3 className="text-lg font-semibold">Options sociales & fiscales ???</h3>
        <ul className="list-disc pl-6">
          <li>Régime: {e.options_sociales?.regime || "-"}</li>
          <li>Périodicité: {e.options_sociales?.periodicite_versement || "-"}</li>
          <li>Franchise TVA: {TVA.franchise_TVA ? "Oui" : "Non"}</li>
          <li>N° TVA intracom: {TVA.numero_TVA_intracom || "-"}</li>
          <li>Versement libératoire IR: {TVA.versement_liberatoire_IR ? "Oui" : "Non"}</li>
          <li>Compta simplifiée: {TVA.comptabilite_simplifiee ? "Oui" : "Non"}</li>
          <li>
            Seuils micro — Services: {TVA.seuils_micro?.services ?? "-"} €,
            Achat/revente: {TVA.seuils_micro?.achat_revente ?? "-"} €
          </li>
        </ul>
      </section>

      {/* Paiement du service */}
      <section>
        <h3 className="text-lg font-semibold">Paiement du service UTILE ?</h3>
        <ul className="list-disc pl-6">
          <li>Montant: {paiement.montant ?? "-"} {paiement.devise || ""}</li>
          <li>Statut: {paiement.statut || "-"}</li>
          <li>Moyen: {paiement.moyen || "-"}</li>
          <li>Facture: {paiement.invoice_id || "-"}</li>
          <li>Reçu: {paiement.recu || "-"}</li>
        </ul>
      </section>

      {/* Données gouvernement */}
      <section>
        <h3 className="text-lg font-semibold">Données gouvernement</h3>
        <ul className="list-disc pl-6">
          <li>INPI/Guichet unique: {INPI.etat || "-"} — dossier {INPI.numero_dossier || "-"} — MAJ {fmt(INPI.derniere_mise_a_jour)}</li>
          <li>INSEE/SIRENE — SIREN {INSEE.SIREN || "-"}, SIRET {INSEE.SIRET_principal || "-"}, APE {INSEE.code_APE || "-"}</li>
          <li>URSSAF — {URSSAF.affiliation || "-"}{URSSAF.numero_affiliation ? `, n° ${URSSAF.numero_affiliation}` : ""}</li>
          <li>RNE — {RNE.inscription || "-"}</li>
        </ul>
      </section>

      {/* Conformité */}
      <section>
        <h3 className="text-lg font-semibold">Conformité (checklist)</h3>
        <ul className="list-disc pl-6">
          <li>Pièce d’identité: {check.piece_identite || "-"}</li>
          <li>Justif. domicile: {check.justificatif_domicile || "-"}</li>
          <li>RIB: {check.rib || "-"}</li>
          <li>RC Pro: {check.rc_pro || "-"}</li>
          <li>Non-condamnation: {check.declaration_non_condamnation || "-"}</li>
        </ul>
      </section>

      {/* Documents générés */}
      <section>
        <h3 className="text-lg font-semibold">Documents générés</h3>
        <ul className="list-disc pl-6">
          {docs.length
            ? docs.map((d, i) => (
                <li key={i}>
                  {fmt(d.date)} — {d.type} — {d.fichier} — source {d.source}
                </li>
              ))
            : <li>Aucun document</li>}
        </ul>
      </section>

      {/* Scraping jobs */}
      <section>
        <h3 className="text-lg font-semibold">Scraping jobs</h3>
        <ul className="list-disc pl-6">
          {jobs.length
            ? jobs.map(j => <li key={j.id}>{j.portail} — {j.etat} — {j.last_event} — MAJ {fmt(j.updated_at)}</li>)
            : <li>Aucun job</li>}
        </ul>
      </section>

      {/* Dossiers reliés */}
      <section>
        <h3 className="text-lg font-semibold">Dossiers reliés</h3>
        <ul className="list-disc pl-6">
          {dossiers.length
            ? dossiers.map(d => (
                <li key={d.id}>
                  Dossier #{d.id} — statut {d.statut} — client{" "}
                  <Link className="underline" href={`/crm/dashboard/clients/${d.client_id}`}>#{d.client_id}</Link>
                </li>
              ))
            : <li>Aucun dossier</li>}
        </ul>
      </section>
    </main>
  );
}
