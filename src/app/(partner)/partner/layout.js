import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Espace partenaire</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/partner/dashboard" className="underline">Dashboard</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
