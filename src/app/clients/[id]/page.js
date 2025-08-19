"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClientPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setData(null); setErr(null);
    fetch(`/api/clients/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(setData)
      .catch(() => setErr("Erreur chargement client"));
  }, [id]);

  if (err) return <main className="p-6"><Link href="/">← Retour</Link><p>{err}</p></main>;
  if (!data) return <main className="p-6">Chargement…</main>;

  const c = data.client;
  const pieces = data.pieces_justificatives || [];
  const zone = data.zone_echange || [];
  const histo = data.historique_echanges || [];
  const dossiers = data.dossiers || [];
  const adr = c.adresse_personnelle || {};
  const adrfis = c.adresse_fiscale || {};
  const downloads = data.telechargements_disponibles || [];

  return (
    <main className="p-6 space-y-6">
      <Link href="/">← Retour</Link>
      <h1 className="text-2xl font-bold">{c.prenom} {c.nom}</h1>
      <p>{c.email} — {c.telephone}</p>

      <section>
        <h3 className="text-lg font-semibold">Identité & adresses</h3>
        <ul className="list-disc pl-6">
          <li>Naissance: {c.date_naissance} — {c.commune_naissance}, {c.pays_naissance} — {c.nationalite}</li>
          <li>Adresse perso: {adr.ligne1}, {adr.code_postal} {adr.ville}</li>
          <li>Adresse fiscale{adrfis.est_differente ? "" : " (identique)"}: {adrfis.ligne1}, {adrfis.code_postal} {adrfis.ville}</li>
          <li>NIR: {c.numero_securite_sociale}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Pièces justificatives</h3>
        <ul className="list-disc pl-6">
          {pieces.map((p, i) => <li key={i}>{p.type} — {p.fichier} — {p.statut}{p.motif_refus ? ` (${p.motif_refus})` : ""} {p.uploaded_at ? `(${new Date(p.uploaded_at).toISOString().slice(0,10)})` : ""}</li>)}
          {pieces.length === 0 && <li>Aucune</li>}
        </ul>

        <h4 className="font-medium mt-3">Téléchargements disponibles</h4>
        <ul className="list-disc pl-6">
          {downloads.map((d, i) => <li key={i}>{d.type} — {d.fichier}</li>)}
          {downloads.length === 0 && <li>Aucun</li>}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Échanges</h3>
        <p className="font-medium">Zone d’échange</p>
        <ul className="list-disc pl-6">
          {zone.map((z, i) => <li key={i}><strong>{z.from}</strong>: {z.message} ({z.date})</li>)}
          {zone.length === 0 && <li>Aucun message</li>}
        </ul>
        <p className="font-medium mt-3">Historique notifications</p>
        <ul className="list-disc pl-6">
          {histo.map((h, i) => <li key={i}>{h.date} — {h.type}: {h.note}</li>)}
          {histo.length === 0 && <li>Aucun</li>}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Dossiers & entreprise</h3>
        <ul className="list-disc pl-6">
          {dossiers.map(d => (
            <li key={d.id}>
              Dossier #{d.id} — statut {d.statut} — créé {d.date_creation}
              {" — "}partenaire <Link className="underline" href={`/partenaires/${d.partenaire_id}`}>#{d.partenaire_id}</Link>
              {" — "}entreprise <Link className="underline" href={`/entreprises/${d.entreprise_id}`}>#{d.entreprise_id}</Link>
              {(d.blocages || []).length ? <> — blocages: {(d.blocages || []).join(", ")}</> : null}
            </li>
          ))}
          {dossiers.length === 0 && <li>Aucun dossier</li>}
        </ul>
      </section>
    </main>
  );
}
