import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">CRM</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/crm/dashboard" className="underline">
            Dashboard
          </Link>
          <Link href="/crm/tickets" className="underline">
            Tickets
          </Link>
          <Link href="/crm/commercial" className="underline">
            Commercial
          </Link>
          <Link href="/crm/exports" className="underline">
            Exports
          </Link>
          {/*
          <Link href="/crm/emails" className="underline">
            Emails
          </Link>      
          <Link href="/crm/clients/1" className="underline">
            Fiche client (ex)
          </Link>
          <Link href="/crm/entreprises/101" className="underline">
            Entreprise (ex)
          </Link>
          <Link href="/crm/partenaires/1" className="underline">
            Partenaire (ex)
          </Link>
          */}
        </nav>
      </header>
      {children}
    </div>
  );
}