// src/app/(crm)/crm/partenaires/[id]/ClientsTableCard.js
"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const show = (v) => (v ?? v === 0 ? String(v) : "—");
const fmtMoney = (v) => (v === 0 ? "0" : v != null ? Number(v).toLocaleString("fr-FR") : "—");

export default function ClientsTableCard({ partnerId, data }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Filtres (contrôlés par la barre d’UI)
  const [filters, setFilters] = useState({
    search: "",
    statut: "tous",
    dateDebut: "",
    dateFin: "",
    showBlocked: false,
    commission: ""
  });

  // Tri + pagination
  const [sortBy, setSortBy] = useState("date_creation");
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    setError(null);
    if (Array.isArray(data?.clients)) {
      setClients(data.clients); // ✓ 100% via API parent
    } else if (partnerId) {
      loadClients();
    } else {
      setClients([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId, data]);

  async function loadClients() {
    try {
      setLoading(true);
      const qp = new URLSearchParams({
        search: filters.search,
        statut: filters.statut,
        dateDebut: filters.dateDebut,
        dateFin: filters.dateFin,
        showBlocked: String(filters.showBlocked),
        commission: filters.commission,
        sortBy,
        sortDesc: String(sortDesc),
        limit: "1000"
      });
      const r = await fetch(`/api/partenaires/${partnerId}/clients?${qp}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      setClients(Array.isArray(json.clients) ? json.clients : []);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les clients");
    } finally {
      setLoading(false);
    }
  }

  const filteredAndSorted = useMemo(() => {
    let arr = [...clients];

    // (On garde un filtrage local pour plus de confort; l’API filtre déjà aussi.)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      arr = arr.filter((c) =>
        (c.fullName || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.entreprise_nom || "").toLowerCase().includes(q) ||
        String(c.dossier_id || "").includes(q)
      );
    }
    if (filters.statut !== "tous") arr = arr.filter((c) => c.statut === filters.statut);
    if (filters.showBlocked) arr = arr.filter((c) => (c.blocages || []).length > 0);
    if (filters.dateDebut) arr = arr.filter((c) => (c.date_creation || "") >= filters.dateDebut);
    if (filters.dateFin) arr = arr.filter((c) => (c.date_creation || "") <= `${filters.dateFin}T23:59:59`);
    if (filters.commission) {
  const min = parseFloat(filters.commission);
  if (!isNaN(min)) arr = arr.filter((c) => (c.commission || 0) >= min);
}

    arr.sort((a, b) => {
      const A = a || {}; const B = b || {};
      const by = {
        nom: [(A.fullName || "").toLowerCase(), (B.fullName || "").toLowerCase()],
        email: [(A.email || "").toLowerCase(), (B.email || "").toLowerCase()],
        statut: [A.statut || "", B.statut || ""],
        commission: [Number(A.commission) || 0, Number(B.commission) || 0],
        date_creation: [new Date(A.date_creation || 0), new Date(B.date_creation || 0)]
      }[sortBy] || [0, 0];
      if (by[0] < by[1]) return sortDesc ? 1 : -1;
      if (by[0] > by[1]) return sortDesc ? -1 : 1;
      return 0;
    });

    return arr;
  }, [clients, filters, sortBy, sortDesc]);

  // Pagination
  useEffect(() => setCurrentPage(1), [filters, sortBy, sortDesc]);
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const start = (currentPage - 1) * itemsPerPage;
  const page = filteredAndSorted.slice(start, start + itemsPerPage);

  // EXPORT CSV (fetch -> blob -> download, avec vérif d’erreur)
  function exportCSV() {
  const qs = new URLSearchParams();
  // mapping vers /api/exports/dossiers
  if (filters.statut !== "tous") qs.set("status", filters.statut);
  if (partnerId) qs.set("partnerId", String(partnerId));
  // (pas d’operatorId ici dans ce composant)
  if (filters.dateDebut) qs.set("from", filters.dateDebut);
  if (filters.dateFin) qs.set("to", filters.dateFin);
  qs.set("format", "csv");

  const url = `/api/exports/dossiers?${qs.toString()}`;

  const a = document.createElement("a");
  a.href = url;
  a.download = `dossiers_partenaire_${partnerId}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

  const StatutBadge = ({ statut, blocages }) => {
    const hasBlocked = (blocages || []).length > 0;
    const map = {
      valide: ["bg-green-100 text-green-800", "✅"],
      rejete: ["bg-red-100 text-red-800", "❌"],
      en_cours: ["bg-blue-100 text-blue-800", "🔄"],
      en_attente: ["bg-orange-100 text-orange-800", "⏳"],
      a_corriger: ["bg-yellow-100 text-yellow-800", "✏️"]
    };
    const [cls, icon] = map[statut] || ["bg-gray-100 text-gray-800", "📋"];
    return (
      <div className="flex items-center gap-1">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${cls}`}>
          <span className="mr-1">{icon}</span>{show(statut)}
        </span>
        {hasBlocked && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            🚫 Bloqué
          </span>
        )}
      </div>
    );
  };

  if (loading && clients.length === 0) {
    return (
      <section className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">👥 Suivi des clients</h3>
        <div className="animate-pulse h-24 bg-gray-200 rounded" />
      </section>
    );
  }
  if (error) {
    return (
      <section className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">👥 Suivi des clients</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="text-red-800">❌ {error}</div>
          <button onClick={loadClients} className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            🔄 Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border rounded-lg">
      {/* Header + actions */}
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">👥 Suivi des clients ({totalItems})</h3>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md"
          >
            🔄 Actualiser
          </button>
          <button
  onClick={exportCSV}
  disabled={exportLoading || totalItems === 0}
  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
>
  {exportLoading ? '⏳' : '📊'} Exporter CSV
</button>

        </div>
      </div>

      {/* 🔎 Barre de filtres (avec bouton Filtrer) */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Rechercher (nom, email, entreprise, #dossier)"
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            className="border rounded px-3 py-2 text-sm"
          />
          <select
            value={filters.statut}
            onChange={(e) => setFilters(f => ({ ...f, statut: e.target.value }))}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="tous">Tous statuts</option>
            <option value="nouveau">Nouveau</option>
            <option value="en_cours">En cours</option>
            <option value="en_attente">En attente</option>
            <option value="a_corriger">À corriger</option>
            <option value="valide">Validé</option>
            <option value="rejete">Rejeté</option>
          </select>
          <input
            type="date"
            value={filters.dateDebut}
            onChange={(e) => setFilters(f => ({ ...f, dateDebut: e.target.value }))}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={filters.dateFin}
            onChange={(e) => setFilters(f => ({ ...f, dateFin: e.target.value }))}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Commission min (€)"
            value={filters.commission}
            onChange={(e) => setFilters(f => ({ ...f, commission: e.target.value }))}
            className="border rounded px-3 py-2 text-sm"
            min="0"
            step="10"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.showBlocked}
              onChange={(e) => setFilters(f => ({ ...f, showBlocked: e.target.checked }))}
            />
            Bloqués uniquement
          </label>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={loadClients}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
          >
            🔎 Filtrer
          </button>
          <button
            onClick={() => { 
              setFilters({ search:"", statut:"tous", dateDebut:"", dateFin:"", showBlocked:false, commission:"" });
              setSortBy("date_creation"); setSortDesc(true);
              setCurrentPage(1);
              loadClients();
            }}
            className="border px-3 py-2 rounded text-sm"
          >
            Réinitialiser
          </button>

          {/* Tri rapide */}
          <select
            value={`${sortBy}-${sortDesc}`}
            onChange={(e) => {
              const [field, desc] = e.target.value.split("-");
              setSortBy(field); setSortDesc(desc === "true");
            }}
            className="ml-auto border rounded px-2 py-2 text-sm"
          >
            <option value="date_creation-true">Plus récents</option>
            <option value="date_creation-false">Plus anciens</option>
            <option value="nom-false">Nom A→Z</option>
            <option value="nom-true">Nom Z→A</option>
            <option value="statut-false">Statut</option>
            <option value="commission-true">Commission ↓</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {totalItems === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {clients.length === 0 ? "Aucun client trouvé" : "Aucun résultat avec ces filtres"}
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {page.map((c) => (
                <tr key={`${c.id}-${c.dossier_id}`} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{show(c.fullName)}</div>
                    <div className="text-sm text-gray-500">
                      {show(c.email)}{c.telephone ? ` • ${c.telephone}` : ""}
                    </div>
                    <div className="text-xs text-gray-400">Client #{show(c.id)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{show(c.entreprise_nom)}</div>
                    <div className="text-xs text-gray-500">{show(c.entreprise_forme)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <StatutBadge statut={c.statut} blocages={c.blocages} />
                    {(c.blocages || []).length > 0 && (
                      <div className="text-xs text-red-600 mt-1">{c.blocages.join(", ")}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div>Créé: {fmt(c.date_creation)}</div>
                    {c.date_creation_effective && <div className="text-xs text-green-600">Effectif: {fmt(c.date_creation_effective)}</div>}
                    {c.derniere_modification && <div className="text-xs text-gray-500">MAJ: {fmt(c.derniere_modification)}</div>}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="font-medium">{fmtMoney(c.commission)}€</div>
                    <div className="text-xs text-gray-500">Dossier #{show(c.dossier_id)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Link href={`/crm/clients/${c.id}`} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                        👤 Client
                      </Link>
                      <Link
                        href={`/crm/clients/${c.id}?dossier=${c.dossier_id}#timeline`}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                      >
                        📁 Dossier LINK
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de {start + 1} à {Math.min(start + itemsPerPage, totalItems)} sur {totalItems} résultats
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              ← Précédent
            </button>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
