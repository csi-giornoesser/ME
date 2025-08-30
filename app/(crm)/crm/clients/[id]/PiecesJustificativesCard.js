"use client";
const fmt = (d) => (d ? new Date(d).toISOString().slice(0,10) : "—");
const show = (v) => (v ?? v === 0 ? String(v) : "—");

/**
 * props:
 * - pieces: [{type, fichier, statut, motif_refus, uploaded_at}]
 * - downloads: [{type, fichier}]
 * - requiredTypes?: ["Passeport","PhotoIdentite","RIB","CNI"] (optionnel)
 */
export default function PiecesJustificativesCard({ pieces = [], downloads = [], requiredTypes = [] }) {
  // Comptes dérivés de la BDD (pas de valeurs par défaut)
  const total = pieces.length;
  const valides = pieces.filter(p => p.statut === "valide").length;

  const missing = requiredTypes.length
    ? requiredTypes.filter(t => !pieces.some(p => p.type === t))
    : [];

  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">📄 Pièces justificatives</h3>
      <div className="bg-white border rounded p-4">
        {/* État synthétique sans forcer: on affiche ce que dit la BDD */}
        <div className="text-sm mb-3">
          <strong>Statut:</strong> {valides}/{total} validées
          {requiredTypes.length ? (
            <span className="ml-2">
              — Requises manquantes: {missing.length ? missing.join(", ") : "—"}
            </span>
          ) : null}
        </div>

        <ul className="list-disc pl-6">
          {total ? pieces.map((p, i) => (
            <li key={i}>
              {show(p.type)} — {show(p.fichier)} — {show(p.statut)}
              {p.motif_refus ? ` (${p.motif_refus})` : ""} {p.uploaded_at ? `(${fmt(p.uploaded_at)})` : ""}
            </li>
          )) : <li>—</li>}
        </ul>

        <h4 className="font-medium mt-3">Téléchargements disponibles</h4>
        <ul className="list-disc pl-6">
          {downloads.length ? downloads.map((d, i) => (
            <li key={i}>{show(d.type)} — {show(d.fichier)}</li>
          )) : <li>—</li>}
        </ul>
      </div>
    </section>
  );
}
