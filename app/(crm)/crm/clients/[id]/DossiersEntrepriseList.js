"use client";
import Link from "next/link";
const show = (v) => (v ?? v === 0 ? String(v) : "—");

export default function DossiersEntrepriseList({ dossiers = [], dossierPrincipalId }) {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">📂 Dossiers & entreprise</h3>
      <div className="bg-white border rounded p-4">
        {dossiers.length > 1 && dossierPrincipalId && (
          <p className="text-sm text-blue-600 mb-2">
            💡 Timeline ci-dessus pour le dossier principal #{dossierPrincipalId}
          </p>
        )}

        <ul className="list-disc pl-6">
          {dossiers.length ? dossiers.map((d) => (
            <li key={d.id}>
              Dossier #{show(d.id)} — statut {show(d.statut)} — créé {show(d.date_creation)}
              {" — "}partenaire <Link className="underline" href={`/crm/partenaires/${d.partenaire_id}`}>#{show(d.partenaire_id)}</Link>
              {" — "}entreprise <Link className="underline" href={`/crm/entreprises/${d.entreprise_id}`}>#{show(d.entreprise_id)}</Link>
              {(d.blocages || []).length ? <> — blocages: {(d.blocages || []).join(", ")}</> : null}
              {dossierPrincipalId && d.id === dossierPrincipalId && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  📌 Affiché ci-dessus
                </span>
              )}
            </li>
          )) : <li>—</li>}
        </ul>
      </div>
    </section>
  );
}
