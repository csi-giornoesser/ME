"use client";
const fmt = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const show = (v) => (v ?? v === 0 ? String(v) : "—");

export default function ClientIdentityCard({ client }) {
  if (!client) return null;

  const adr = client.adresse_personnelle ?? {};
  const adrfis = client.adresse_fiscale ?? {};

  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">🆔 Identité & adresses</h3>
      <div className="bg-white border rounded p-4">
        <ul className="list-disc pl-6">
          <li>
            Naissance: {fmt(client.date_naissance)} — {show(client.commune_naissance)}, {show(client.pays_naissance)} — {show(client.nationalite)}
          </li>
          <li>
            Adresse perso: {show(adr.ligne1)}, {show(adr.code_postal)} {show(adr.ville)}
          </li>
          <li>
            Adresse fiscale{adrfis.est_differente ? "" : " (identique)"}: {show(adrfis.ligne1)}, {show(adrfis.code_postal)} {show(adrfis.ville)}
          </li>
          <li>NIR: {show(client.numero_securite_sociale)}</li>
        </ul>
      </div>
    </section>
  );
}
