"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const DEMO_CLIENT_ID = 1; // TODO: remplacer par l'id réel issu de l'auth

export default function ClientDashboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/api/dossiers", {
      cache: "no-store",
      headers: {
        "x-role": "client_user",
        "x-client-id": String(DEMO_CLIENT_ID),
      },
    })
      .then(r => r.json())
      .then(d => setRows(d.dossiers || []));
  }, []);

  const d = rows[0];

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">Mon dossier</h2>
      {!d ? (
        <p>Aucun dossier trouvé.</p>
      ) : (
        <div className="space-y-1">
          <div><b>Numéro:</b> #{d.id}</div>
          <div><b>Statut:</b> {d.statut}</div>
          <div>
            <b>Entreprise:</b>{" "}
            <Link className="underline" href={`/crm/entreprises/${d.entreprise_id}`}>#{d.entreprise_id}</Link>
          </div>
        </div>
      )}
    </main>
  );
}
