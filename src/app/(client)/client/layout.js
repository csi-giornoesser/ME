"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const DEMO_PARTNER_ID = 1; // TODO: remplacer par l'id réel issu de l'auth

export default function PartnerDashboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/api/dossiers", {
      cache: "no-store",
      headers: {
        "x-role": "partner_user",
        "x-partner-id": String(DEMO_PARTNER_ID),
      },
    })
      .then(r => r.json())
      .then(d => setRows(d.dossiers || []));
  }, []);

  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">Mes dossiers</h2>
      <ul className="list-disc pl-6">
        {rows.map(d => (
          <li key={d.id}>
            #{d.id} — {d.statut} — client{" "}
            <Link className="underline" href={`/crm/clients/${d.client_id}`}>#{d.client_id}</Link>{" "}
            — entreprise{" "}
            <Link className="underline" href={`/crm/entreprises/${d.entreprise_id}`}>#{d.entreprise_id}</Link>
          </li>
        ))}
        {rows.length === 0 && <li>Aucun dossier</li>}
      </ul>
    </main>
  );
}
