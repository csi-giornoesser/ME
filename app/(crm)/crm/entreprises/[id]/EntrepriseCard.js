"use client";
import Link from "next/link";

/* ---------- Helpers ---------- */

// Date sûre (retourne "—" si invalide)
function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (!Number.isFinite(dt.getTime())) return "—";
  try {
    return dt.toLocaleDateString("fr-FR");
  } catch {
    return "—";
  }
}

// Tri-état booléen, en acceptant 1/0 et strings
function toBoolOrUndef(v) {
  if (v === true || v === false) return v;
  if (v === 1 || v === 0) return Boolean(v);
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "oui") return true;
    if (s === "false" || s === "non") return false;
  }
  return undefined;
}
const showBool = (v) => {
  const b = toBoolOrUndef(v);
  return b === true ? "Oui" : b === false ? "Non" : "—";
};

// Affiche valeur telle quelle, ou "—" si null/undefined/""
const show = (v) => (v ?? v === 0 ? String(v) : "—");

// Concatène des morceaux (ex: adresse) en filtrant vides/"—"
function joinClean(parts, sep = ", ") {
  const cleaned = parts
    .map((x) => (x ?? x === 0 ? String(x) : ""))
    .map((x) => x.trim())
    .filter((x) => x && x !== "—");
  return cleaned.length ? cleaned.join(sep) : "—";
}

/* ---------- Composant ---------- */

export default function EntrepriseCard({ data }) {
  if (!data?.entreprise) return null;

  const e = data.entreprise;
  const docs = Array.isArray(data.documents_generes) ? data.documents_generes : [];
  const jobs = Array.isArray(data.scraping_jobs) ? data.scraping_jobs : [];
  const dossiers = Array.isArray(data.dossiers) ? data.dossiers : [];

  // Compat: mêmes infos, 2 chemins possibles (tout vient de la BDD)
  const INPI   = e.donnees_gouvernement?.guichet_unique_INPI ?? e.gov_inpi ?? {};
  const INSEE  = e.donnees_gouvernement?.INSEE_SIRENE        ?? e.gov_insee ?? {};
  const URSSAF = e.donnees_gouvernement?.URSSAF              ?? e.gov_urssaf ?? {};
  const RNE    = e.donnees_gouvernement?.RNE                 ?? e.gov_rne ?? {};

  const TVA    = e.options_fiscales ?? {};
  const check  = e.checklist_conformite ?? {};
  const tit    = e.titulaire_client;

  // Adresse: on construit proprement sans “—, — —”
  const adr = e.lieu_exercice?.adresse_etablissement ?? e.lieu_exercice?.adresse ?? {};
  const adresseLigne = joinClean([adr.ligne1, adr.code_postal, adr.ville], " ");

  // Activité: description/libellé avec fallback net
  const activiteLabel = e.activite?.description ?? e.activite?.libelle ?? "";

  // INSEE/SIRENE: champs normalisés
  const siren = INSEE.SIREN ?? INSEE.siren;
  const siret = INSEE.SIRET_principal ?? INSEE.siret;
  const ape   = INSEE.code_APE ?? INSEE.ape;

  // URSSAF: n° affiché uniquement s’il existe
  const urssafStatut = URSSAF.affiliation ?? URSSAF.statut;
  const urssafNumero = URSSAF.numero_affiliation ?? URSSAF.numero_compte;

  // Options sociales: gardes simples
  const os = e.options_sociales ?? {};

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">🏢 Mon entreprise</h3>
      <div className="bg-white border rounded p-4 space-y-5">
        {/* En-tête */}
        <div className="border-b pb-3">
          <h4 className="font-semibold text-lg">{show(e.denomination)}</h4>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
            <span><strong>Forme:</strong> {show(e.forme)}</span>
            <span><strong>Statut:</strong> {show(e.statut_dossier)}</span>
            <span>
              <strong>Titulaire:</strong>{" "}
              {tit ? (
                <Link href={`/crm/clients/${tit.id}`} className="underline">
                  {show(joinClean([tit.prenom, tit.nom], " "))}
                </Link>
              ) : "—"}
            </span>
          </div>
        </div>

        {/* Activité & lieu */}
        <div>
          <h5 className="font-medium text-blue-800 mb-2">📍 Activité & lieu</h5>
          <ul className="list-disc pl-6 text-sm">
            <li>Activité: {show(activiteLabel)}</li>
            <li>Catégorie: {show(e.activite?.categorie)} — APE/NAF: {show(e.activite?.APE_NAF ?? e.activite?.code_ape)}</li>
            <li>Réglem.: {showBool(e.activite?.profession_reglementee)}</li>
            <li>Établissement: {adresseLigne}</li>
          </ul>
        </div>

        {/* Dates */}
        <div>
          <h5 className="font-medium text-green-800 mb-2">📅 Dates importantes</h5>
          <ul className="list-disc pl-6 text-sm">
            <li>Demande: {fmt(e.dates?.date_demande ?? e.dates?.demande)}</li>
            <li>Début d’activité: {fmt(e.dates?.date_debut_activite ?? e.dates?.debut_activite)}</li>
            <li>Immatriculation réelle: {fmt(e.dates?.date_immatriculation_reelle ?? e.dates?.immatriculation_reelle)}</li>
          </ul>
        </div>

        {/* Options sociales & fiscales */}
        {(e.options_sociales || e.options_fiscales) && (
          <div>
            <h5 className="font-medium text-purple-800 mb-2">⚖️ Options sociales & fiscales</h5>
            <ul className="list-disc pl-6 text-sm">
              <li>Régime: {show(os.regime)}</li>
              <li>Périodicité: {show(os.periodicite_versement ?? os.periodicite)}</li>
              <li>Franchise TVA: {showBool(TVA.franchise_TVA ?? TVA.franchise_tva)}</li>
              <li>N° TVA intracom: {show(TVA.numero_TVA_intracom ?? TVA.numero_tva)}</li>
              <li>Versement libératoire IR: {showBool(TVA.versement_liberatoire_IR ?? TVA.versement_liberatoire)}</li>
              <li>Compta simplifiée: {showBool(TVA.comptabilite_simplifiee)}</li>
            </ul>
          </div>
        )}

        {/* Données gouvernement */}
        <div>
          <h5 className="font-medium text-red-800 mb-2">🏛️ Données gouvernement</h5>
          <ul className="list-disc pl-6 text-sm">
            <li>
              INPI: {show(INPI.etat ?? INPI.statut)} — dossier {show(INPI.numero_dossier ?? INPI.dossier)} — MAJ {fmt(INPI.derniere_mise_a_jour ?? INPI.derniere_maj)}
            </li>
            <li>
              INSEE/SIRENE — SIREN {show(siren)}, SIRET {show(siret)}, APE {show(ape)}
            </li>
            <li>
              URSSAF — {show(urssafStatut)}
              {urssafNumero ? `, n° ${urssafNumero}` : ""}
            </li>
            <li>RNE — {show(RNE.inscription ?? RNE.statut)}</li>
          </ul>
        </div>

        {/* Conformité */}
        {check && Object.keys(check).length > 0 && (
          <div>
            <h5 className="font-medium text-green-800 mb-2">✅ Conformité (checklist)</h5>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {Object.entries(check).map(([k, v]) => {
                const ok = v === "ok" || v === true || v === 1 || (typeof v === "string" && v.toLowerCase() === "true");
                const ko = v === "ko" || v === false || v === 0 || (typeof v === "string" && v.toLowerCase() === "false");
                return (
                  <div key={k} className="flex items-center gap-2">
                    <span className={ok ? "text-green-600" : ko ? "text-red-600" : "text-gray-500"}>
                      {ok ? "✅" : ko ? "❌" : "—"}
                    </span>
                    <span>{k.replace(/_/g, " ")}: {show(v)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Documents générés */}
        <div>
          <h5 className="font-medium text-gray-800 mb-2">📋 Documents générés</h5>
          {docs.length ? (
            <ul className="space-y-1 text-sm">
              {docs.map((d, i) => (
                <li key={i}>
                  {fmt(d.date)} — {show(d.type)} — {show(d.fichier)} — source {show(d.source)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">—</p>
          )}
        </div>

        {/* Scraping jobs */}
        <div>
          <h5 className="font-medium text-gray-800 mb-2">🕸️ Scraping jobs</h5>
          {jobs.length ? (
            <ul className="space-y-1 text-sm">
              {jobs.map((j) => (
                <li key={j.id ?? `${j.portail}-${j.updated_at ?? ""}`}>
                  {show(j.portail)} — {show(j.etat)} — {show(j.last_event)} — MAJ {fmt(j.updated_at)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">—</p>
          )}
        </div>

        {/* Dossiers reliés */}
        <div>
          <h5 className="font-medium text-gray-800 mb-2">📂 Dossiers reliés</h5>
          {dossiers.length ? (
            <ul className="space-y-1 text-sm">
              {dossiers.map((d) => (
                <li key={d.id}>
                  Dossier #{show(d.id)} — statut {show(d.statut)} — client{" "}
                  {d.client_id ? (
                    <Link className="underline" href={`/crm/clients/${d.client_id}`}>#{show(d.client_id)}</Link>
                  ) : "—"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">—</p>
          )}
        </div>
      </div>
    </section>
  );
}
