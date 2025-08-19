import Link from "next/link";

export default function Page() {
  return (
    <main className="p-2">
      <p>Bienvenue sur l’espace CRM.</p>
      <p><Link className="underline" href="/crm/dashboard">Aller au dashboard</Link></p>
    </main>
  );
}
