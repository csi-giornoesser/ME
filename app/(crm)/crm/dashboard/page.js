"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ====== COMPOSANTS RÉUTILISÉS (chemins relatifs depuis /dashboard) ====== */
import DossierTimeline from "../clients/[id]/DossierTimeline";
import ClientIdentityCard from "../clients/[id]/ClientIdentityCard";
import PiecesJustificativesCard from "../clients/[id]/PiecesJustificativesCard";
import CommsHistory from "../clients/[id]/CommsHistory";
import ClientMessaging from "../clients/[id]/ClientMessaging";

// 👉 côté partenaire
import PartnerTracking from "../partenaires/[id]/PartnerTracking";
import InvoicesCommissionsCard from "../partenaires/[id]/InvoicesCommissionsCard";

// 👉 carte entreprise existante
import EntrepriseCard from "../entreprises/[id]/EntrepriseCard";


/* ====== UTILS ====== */
function parseISO(d){ return d ? new Date(d) : null; }
function inRange(d, from, to){
  if (!d) return true;
  const dt = typeof d === "string" ? new Date(d) : d;
  if (from && dt < from) return false;
  if (to) { const end = new Date(to); end.setHours(23,59,59,999); if (dt > end) return false; }
  return true;
}
const fmt = (d) => d ? new Date(d).toLocaleString("fr-FR") : "-";
function euro(n){ if(n === 0) return "0€"; if(n == null) return "—"; return `${Number(n).toLocaleString("fr-FR")}€`; }
function safe(s){ return s ?? "—"; }

/* ====== CARTES ALERTE & ACTIVITÉ ====== */
function AlertCard({ alert, onAction }) {
  const getAlertStyle = (priority) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'important': return 'border-orange-500 bg-orange-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };
  const getAlertIcon = (priority) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'important': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };
  return (
    <div className={`border-l-4 p-3 rounded ${getAlertStyle(alert.priority)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{getAlertIcon(alert.priority)}</span>
          <span className="font-semibold">{alert.title}</span>
        </div>
        <button 
          className="text-xs bg-white px-2 py-1 rounded border"
          onClick={() => onAction(alert)}
        >
          {alert.action === 'traiter' ? '🔧 Traiter' : 
           alert.action === 'assigner' ? '👤 Assigner' :
           alert.action === 'relancer' ? '📞 Relancer' : '👀 Voir'}
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
      {alert.items && alert.items.length > 0 && (
        <div className="space-y-1">
          {alert.items.slice(0, 3).map((item, i) => (
            <div key={i} className="text-xs bg-white p-2 rounded">
              <Link href={item.link} className="font-medium text-blue-600 hover:underline">
                {item.label}
              </Link>
              <div className="text-gray-500">{item.detail}</div>
            </div>
          ))}
          {alert.items.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{alert.items.length - 3} autres...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActivityCard({ activity }) {
  const getActivityColor = (color) => {
    switch (color) {
      case 'blue': return 'border-l-blue-500 bg-blue-50';
      case 'green': return 'border-l-green-500 bg-green-50';
      case 'yellow': return 'border-l-yellow-500 bg-yellow-50';
      case 'orange': return 'border-l-orange-500 bg-orange-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };
  return (
    <div className={`border-l-4 p-2 rounded ${getActivityColor(activity.color)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{activity.icon}</span>
          <Link href={activity.link} className="font-medium text-blue-600 hover:underline">
            {activity.title}
          </Link>
        </div>
        <span className="text-xs text-gray-500">
          {fmt(activity.timestamp).replace(/:\d{2}$/, '')}
        </span>
      </div>
      <div className="text-sm text-gray-600 ml-6">{activity.description}</div>
      {activity.detail && (
        <div className="text-xs text-gray-500 ml-6 mt-1">{activity.detail}</div>
      )}
    </div>
  );
}

/* ====== PAGE DASHBOARD ====== */
export default function Dashboard() {
  // États filtres & data
  const [status, setStatus] = useState("all");
  const [partnerId, setPartnerId] = useState("all");
  const [operatorId, setOperatorId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const isLoading = !data && !err;

  // Alertes & activités
  const [alerts, setAlerts] = useState(null);
  const [activities, setActivities] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Charger le dashboard
  async function load() {
    const qs = new URLSearchParams();
    if (status !== "all") qs.set("status", status);
    if (partnerId !== "all") qs.set("partnerId", partnerId);
    if (operatorId !== "all") qs.set("operatorId", operatorId);
    if (dateFrom) qs.set("from", dateFrom);
    if (dateTo) qs.set("to", dateTo);
    setErr(null);
    try {
      const r = await fetch(`/api/dashboard?${qs.toString()}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      setData(json);
    } catch (e) {
      setErr(String(e));
    }
  }

  // Alertes + activités
  async function loadAlerts() {
    setAlertsLoading(true);
    try {
      const [alertsRes, activitiesRes] = await Promise.all([
        fetch("/api/alerts", { cache: "no-store" }),
        fetch("/api/recent-activities", { cache: "no-store" })
      ]);
      if (alertsRes.ok) setAlerts(await alertsRes.json());
      if (activitiesRes.ok) {
        const a = await activitiesRes.json();
        setActivities(a.activities || []);
      }
    } catch (e) {
      console.error("Erreur chargement alertes:", e);
    } finally {
      setAlertsLoading(false);
    }
  }

  useEffect(() => {
    load();
    loadAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, partnerId, operatorId, dateFrom, dateTo]);

  // Actions
  async function changeStatut(dossierId, newStatut) {
    await fetch(`/api/dossiers/${dossierId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: newStatut })
    });
    await load();
    await loadAlerts();
  }

  async function createTicket(dossierId, clientNom) {
    const subject = prompt("Sujet du ticket:", `Support client ${clientNom || 'Inconnu'}`);
    if (!subject) return;
    try {
      await fetch(`/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dossier_id: dossierId,
          subject,
          priorite: "Moyenne",
          message: "Ticket créé depuis le dashboard CRM"
        })
      });
      await load();
      await loadAlerts();
    } catch (e) {
      console.error("Erreur création ticket:", e);
      alert("Erreur lors de la création du ticket");
    }
  }

  async function planRelance(dossierId, clientId) {
    const in1h = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await fetch(`/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "relance_piece",
        client_id: clientId,
        dossier_id: dossierId,
        canal: "email",
        scheduled_for: in1h
      })
    });
    await load();
  }

  async function exportDossiers() {
    const qs = new URLSearchParams();
    if (status !== "all") qs.set("status", status);
    if (partnerId !== "all") qs.set("partnerId", partnerId);
    if (operatorId !== "all") qs.set("operatorId", operatorId);
    if (dateFrom) qs.set("from", dateFrom);
    if (dateTo) qs.set("to", dateTo);
    qs.set("format", "csv");
    try {
      const url = `/api/exports/dossiers?${qs.toString()}`;
      const link = document.createElement("a");
      link.href = url;
      link.download = `dossiers_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Erreur export:", e);
      alert("Erreur lors de l'export");
    }
  }

  // …dans Dashboard(), après tes autres fonctions (changeStatut, createTicket, planRelance, exportDossiers) :

function handleAlertAction(a) {
  switch (a.action) {
    case "traiter":
      // Exemple : redirige les filtres en fonction du type d’alerte
      if (a.type === "dossiers_blocked") setStatus("en_attente");
      if (a.type === "dossiers_a_corriger") setStatus("a_corriger");
      break;

    case "assigner":
      window.location.href = "/crm/tickets?priorite=Haute";
      break;

    case "relancer":
      window.alert("Fonctionnalité de relance à implémenter");
      break;

    default:
      if (a.items && a.items.length > 0) {
        window.location.href = a.items[0].link;
      }
  }
}


  // Référentiels
  const partners = data?.partenaires ?? [];
  const operators = data?.operateurs ?? [];
  const dossiers = data?.dossiers ?? [];
  const clients = data?.clients ?? [];
  const statusesRef = data?.refs?.statuts_dossier ?? [];
  const notifications = data?.notifications_queue ?? [];
  const authLogs = data?.auth_logs ?? [];

  // Filtres
  const filtered = useMemo(() => {
    const from = dateFrom ? parseISO(dateFrom) : null;
    const to = dateTo ? parseISO(dateTo) : null;
    return dossiers.filter((d) => {
      const okStatus = status === "all" ? true : d.statut === status;
      const okPartner = partnerId === "all" ? true : String(d.partenaireId) === String(partnerId);
      const okOperator = operatorId === "all" ? true : String(d.operateurId) === String(operatorId);
      const okDate = inRange(d.date_creation, from, to);
      return okStatus && okPartner && okOperator && okDate;
    });
  }, [dossiers, status, partnerId, operatorId, dateFrom, dateTo]);

  const kpis = useMemo(() => {
    const counts = {};
    (statusesRef.length ? statusesRef : Array.from(new Set(dossiers.map(d => d.statut))))
      .forEach(s => counts[s] = 0);
    filtered.forEach(d => counts[d.statut] = (counts[d.statut] || 0) + 1);
    return counts;
  }, [filtered, dossiers, statusesRef]);

  const clientById = (id) => clients.find(c => String(c.id) === String(id));
  const partById = (id) => partners.find(p => String(p.id) === String(id));
  const resetFilters = () => { setStatus("all"); setPartnerId("all"); setOperatorId("all"); setDateFrom(""); setDateTo(""); };

  if (err) return <main className="p-6"><h1 className="text-xl font-bold">Erreur</h1><pre className="mt-2">{err}</pre></main>;
  if (isLoading) return <main className="p-6">Chargement…</main>;

  // Alertes à afficher
  const allAlerts = alerts ? [
    ...alerts.alerts.critical,
    ...alerts.alerts.important,
    ...(showAllAlerts ? alerts.alerts.info : [])
  ] : [];

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">CRM — Dashboard</h1>
        <Link href="/crm/tickets" className="text-sm text-blue-600 underline">→ Voir tous les tickets</Link>
        <button onClick={loadAlerts} className="text-sm bg-blue-600 text-white px-3 py-1 rounded" disabled={alertsLoading}>
          {alertsLoading ? "🔄" : "🔄 Actualiser alertes"}
        </button>
      </div>

      {/* 🚨 ALERTES */}
      {alerts && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">🚨 Alertes prioritaires</h2>
            <div className="flex gap-2 text-sm">
              {alerts.summary.critical > 0 && <span className="bg-red-100 text-red-800 px-2 py-1 rounded">🔴 {alerts.summary.critical} critiques</span>}
              {alerts.summary.important > 0 && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">🟡 {alerts.summary.important} importantes</span>}
              {alerts.summary.info > 0 && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🔵 {alerts.summary.info} info</span>}
            </div>
          </div>

          {allAlerts.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
              ✅ Aucune alerte critique ou importante ! Tout va bien.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {allAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} onAction={handleAlertAction} />
              ))}
            </div>
          )}

          {alerts.summary.info > 0 && !showAllAlerts && (
            <div className="text-center">
              <button onClick={() => setShowAllAlerts(true)} className="text-sm text-blue-600 underline">
                + Voir les {alerts.summary.info} alertes informatives
              </button>
            </div>
          )}
        </section>
      )}

      {/* 📊 ACTIVITÉS */}
      {activities.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">📊 Activité récente</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {activities.slice(0, 6).map((activity, i) => (
              <ActivityCard key={i} activity={activity} />
            ))}
          </div>
          {activities.length > 6 && (
            <div className="text-center mt-3">
              <Link href="/crm/activities" className="text-sm text-blue-600 underline">Voir toute l'activité →</Link>
            </div>
          )}
        </section>
      )}

      {/* FILTRES */}
      <section className="border rounded p-4 space-y-3">
        <div className="grid md:grid-cols-5 gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Statut</span>
            <select className="border rounded p-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="all">Tous</option>
              {(statusesRef.length ? statusesRef : Array.from(new Set(dossiers.map(d=>d.statut)))).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Partenaire</span>
            <select className="border rounded p-2" value={partnerId} onChange={(e)=>setPartnerId(e.target.value)}>
              <option value="all">Tous</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Opérateur</span>
            <select className="border rounded p-2" value={operatorId} onChange={(e)=>setOperatorId(e.target.value)}>
              <option value="all">Tous</option>
              {operators.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Du</span>
            <input type="date" className="border rounded p-2" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Au</span>
            <input type="date" className="border rounded p-2" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
          </label>
        </div>

        <div className="flex gap-3">
          <button className="border rounded px-3 py-2" onClick={resetFilters}>Réinitialiser</button>
          <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={exportDossiers}>
            📊 Exporter CSV ({filtered.length})
          </button>
          <div className="text-sm text-gray-600 self-center">{filtered.length} dossier(s) sur {dossiers.length}</div>
        </div>
      </section>

      {/* KPIs */}
      <section>
        <h2 className="text-xl font-semibold mb-2">KPIs dossiers (filtrés)</h2>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(kpis).map(([s, n]) => (
            <div key={s} className="border rounded p-3">
              <div className="text-sm text-gray-600">{s}</div>
              <div className="text-2xl font-bold">{n}</div>
            </div>
          ))}
          <div className="border rounded p-3">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold">{filtered.length}</div>
          </div>
        </div>
      </section>

      {/* LISTE DOSSIERS */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Dossiers</h2>
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-600">Aucun résultat avec ces filtres.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-3">
            {filtered.map(d => {
              const client = clientById(d.clientId);
              return (
                <DossierRow
                  key={d.id}
                  dossier={d}
                  client={client}
                  partner={partById(d.partenaireId)}
                  changeStatut={changeStatut}
                  createTicket={createTicket}
                  planRelance={planRelance}
                />
              );
            })}
          </ul>
        )}
      </section>

      {/* NOTIFS */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Notifications & relances programmées</h2>
        <ul className="list-disc pl-6 space-y-1">
          {notifications.length ? notifications.map((n) => (
            <li key={n.id}>
              {n.type} — client{" "}
              <Link className="underline" href={`/crm/clients/${n.clientId}`}>
                #{n.clientId}
              </Link>{" "}
              — <span className="italic text-gray-700">"{n.message || "—"}"</span> — dossier #{n.dossierId} — {n.canal} — prévu le{" "}
              {new Date(n.scheduled_for).toLocaleString("fr-FR")}
            </li>
          )) : (
            <li>Aucune notification programmée.</li>
          )}
        </ul>
      </section>


      {/* TICKETS */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Tickets récents</h2>
        <div className="text-sm">
          <Link href="/crm/tickets" className="underline">Voir tous les tickets →</Link>
        </div>
      </section>

      {/* LOGS */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Connexions (sécurité)</h2>
        <ul className="list-disc pl-6 space-y-1">
          {authLogs.length ? authLogs.map((l,i) => (
            <li key={i}>{l.at} — {l.role} {l.who} — {l.action} — {l.success ? "✅" : "❌"} — IP {l.ip}</li>
          )) : <li>Aucune entrée</li>}
        </ul>
      </section>
    </main>
  );
}




function DossierRow({ dossier, client, partner, changeStatut, createTicket, planRelance }) {
  const [showRelanceModal, setShowRelanceModal] = useState(false);
  const [relanceMessage, setRelanceMessage] = useState("");

  async function envoyerRelance() {
  try {
    const res = await fetch(`/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "relance_piece",
        client_id: dossier.clientId,
        dossier_id: dossier.id,
        canal: "email",
        scheduled_for: new Date().toISOString(),
        message: relanceMessage || "Pas de message fourni"
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    // ✅ AJOUTEZ CES LIGNES :
    // Recharger les données du client pour voir la nouvelle notification
    if (details && dossier.clientId) {
      const r = await fetch(`/api/clients/${dossier.clientId}`, { cache: "no-store" });
      if (r.ok) {
        const updatedData = await r.json();
        setDetails(updatedData); // Mettre à jour les détails
      }
    }
    
    alert("✅ Relance envoyée !");
    setShowRelanceModal(false);
    setRelanceMessage("");
  } catch (e) {
    console.error("Erreur relance:", e);
    alert("❌ Impossible d'envoyer la relance");
  }
}



  const [open, setOpen] = useState(false);               // panneau client/dossier
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [details, setDetails] = useState(null);

  // 🏢 État pour la fiche entreprise inline (CE QUI MANQUAIT)
  const [entrepriseCard, setEntrepriseCard] = useState(null);
  const [entrepriseCardLoading, setEntrepriseCardLoading] = useState(false);
  const [entrepriseCardErr, setEntrepriseCardErr] = useState(null);

  // 👇 panneau partenaire (au clic sur le nom)
  const [pOpen, setPOpen] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [pErr, setPErr] = useState(null);
  const [pDetails, setPDetails] = useState(null);

  // charge fiche client/dossier quand on ouvre "Voir plus"
  async function toggle() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (details) return; // déjà chargé
    try {
      setLoading(true); setErr(null);
      const r = await fetch(`/api/clients/${dossier.clientId}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setDetails(j);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const eid = dossier?.entrepriseId;
    if (!eid || entrepriseCard) return; // déjà chargé ou pas d'entreprise

    let cancelled = false;
    (async () => {
      try {
        setEntrepriseCardLoading(true);
        const r = await fetch(`/api/entreprises/${eid}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || r.statusText);
        if (!cancelled) setEntrepriseCard(j);
      } catch (e) {
        if (!cancelled) setEntrepriseCardErr(String(e.message || e));
      } finally {
        if (!cancelled) setEntrepriseCardLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [open, dossier?.entrepriseId, entrepriseCard]); // ⚠️ taille FIXE (3)

  // charge fiche partenaire quand on clique sur le nom
  async function togglePartner(e) {
    e.preventDefault();
    e.stopPropagation();
    if (pOpen) { setPOpen(false); return; }
    setPOpen(true);
    if (pDetails) return; // déjà chargé
    try {
      setPLoading(true); setPErr(null);
      const r = await fetch(`/api/partenaires/${dossier.partenaireId}`, { cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || r.statusText);
      setPDetails(j);
    } catch (e) {
      setPErr(String(e.message || e));
    } finally {
      setPLoading(false);
    }
  }

  const clientNom = client ? `${client.prenom ?? ""} ${client.nom ?? ""}`.trim() || `#${client.id}` : `#${dossier.clientId}`;

  // helpers partenaire
  const p = pDetails?.partenaire || {};
  const docs = p.docs || {};

  return (
    <li className="space-y-2">
      {/* ——— LIGNE RÉSUMÉ ——— */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">#{dossier.id}</span>
        <span>— statut: {dossier.statut}</span>
        <span>— créé: {dossier.date_creation}</span>
        <span>— modif: {dossier.derniere_modification ?? "-"}</span>
        <span>— client: {client ? clientNom : dossier.clientId}</span>

        {/* 👇 rend le nom partenaire cliquable pour ouvrir le panneau partenaire inline */}
        <span>
          — partenaire:{" "}
          <button
            type="button"
            onClick={togglePartner}
            className="underline text-blue-600 hover:text-blue-800"
            title="Afficher les infos du partenaire"
          >
            {partner ? partner.nom : dossier.partenaireId}
          </button>
        </span>

        <span>— entreprise: #{dossier.entrepriseId}</span>
        {(dossier.blocages || []).length ? <span>— blocages: {(dossier.blocages || []).join(", ")}</span> : null}
        <span>— commission: {dossier.commission_partenaire_eur ?? 0}€</span>

        {/* Actions */}
        <div className="inline-flex gap-2 ml-2">
          <select
            className="border rounded px-1 py-0.5 text-sm"
            value={dossier.statut}
            onChange={(e) => changeStatut(dossier.id, e.target.value)}
          >
            {["nouveau","en_cours","en_attente","a_corriger","valide","rejete"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/*<button className="border rounded px-2 py-0.5 text-sm" onClick={() => createTicket(dossier.id, clientNom)}>+ Ticket</button>*/}

         <button
  className="border rounded px-2 py-0.5 text-sm"
  onClick={() => setShowRelanceModal(true)}
>
  📩 Relancer
</button>

{showRelanceModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <h3 className="text-lg font-semibold mb-4">Relancer le client</h3>
      <textarea
        value={relanceMessage}
        onChange={(e) => setRelanceMessage(e.target.value)}
        placeholder="Votre message..."
        className="border rounded w-full p-2 mb-4 h-24"
      />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowRelanceModal(false)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          onClick={envoyerRelance}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Envoyer
        </button>
      </div>
    </div>
  </div>
)}



          {/* Voir plus -> ouvre le panneau inline (client/dossier) */}
          <button className="border rounded px-2 py-0.5 text-sm" onClick={toggle}>
            {open ? "Masquer" : "Voir plus"}
          </button>
        </div>
      </div>

      {/* ——— PANNEAU PARTENAIRE INLINE (clic sur le nom) ——— */}
      {pOpen && (
        <div className="mt-2 border-l-2 pl-4">
          {pLoading && <div className="text-sm text-gray-500">Chargement…</div>}
          {pErr && <div className="text-sm text-red-600">❌ {pErr}</div>}

          {!pLoading && !pErr && (
            <div className="space-y-6">
              {/* En-tête partenaire + infos clés */}
              <section className="bg-gray-50 rounded p-3">
                <h4 className="font-semibold mb-1">🤝 Partenaire</h4>
                {p && Object.keys(p).length ? (
                  <div className="text-sm">
                    <div><b>{p.nom || `#${dossier.partenaireId}`}</b> — segment {p.segment || "—"}</div>
                    <div>Référent: {p.referent?.nom || "—"} — {p.referent?.email || "—"} — {p.referent?.telephone || "—"}</div>
                    <div>Taux commission: {p.taux_commission ?? "—"}% • Facturation: {p.type_facturation || "—"}</div>
                    <div>Paiement: {p.paiement?.mode || "—"} • IBAN: {p.paiement?.iban ? `${p.paiement.iban.slice(0, 8)}…` : "—"} • BIC: {p.paiement?.bic || "—"}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Contrat: {p.contrat?.statut || "—"} • signé le {p.contrat?.date_signature || "—"} • durée {p.contrat?.duree_mois ?? "—"} mois
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">—</div>
                )}
              </section>

              {/* 📊 Tableau de Bord (commissions/factures) – réutilise ton composant */}
              <section>
                <h4 className="font-semibold mb-2">📊 Tableau de Bord</h4>
                <InvoicesCommissionsCard
                  partnerId={dossier.partenaireId}
                  data={pDetails}                 // ⬅️ on passe le JSON déjà chargé: { partenaire, factures, ... }
                />
              </section>


              {/* 📈 Suivi Commercial – réutilise ton composant */}
              <section>
                <h4 className="font-semibold mb-2">📈 Suivi Commercial</h4>
                <PartnerTracking partnerId={dossier.partenaireId} />
              </section>

              {/* 📁 Espace documentaire */}
              <section className="bg-gray-50 rounded p-3">
                <h4 className="font-semibold mb-1">📁 Espace documentaire</h4>
                {docs && (docs.contrat_pdf || docs.modalites_collaboration_pdf || (docs.documentation_tech || []).length) ? (
                  <ul className="list-disc pl-5 text-sm">
                    <li>
                      Contrat:{" "}
                      {docs.contrat_pdf
                        ? <a className="underline text-blue-600" href={docs.contrat_pdf} target="_blank" rel="noreferrer">ouvrir</a>
                        : "—"}
                    </li>
                    <li>
                      Modalités:{" "}
                      {docs.modalites_collaboration_pdf
                        ? <a className="underline text-blue-600" href={docs.modalites_collaboration_pdf} target="_blank" rel="noreferrer">ouvrir</a>
                        : "—"}
                    </li>
                    {(docs.documentation_tech || []).map((d, i) => (
                      <li key={i}>{d.type || "Doc"} — {d.url ? <a className="underline text-blue-600" href={d.url} target="_blank" rel="noreferrer">{d.url}</a> : "—"}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">—</div>
                )}
              </section>

              {/* 📋 Informations détaillées */}
              <section>
                <h4 className="font-semibold mb-1">📋 Informations détaillées</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Adresse: {p.adresse || "—"}</li>
                  <li>Coord. facturation: {p.coordonnees_facturation?.societe || "—"} — {p.coordonnees_facturation?.email_facturation || "—"} — {p.coordonnees_facturation?.adresse || "—"}</li>
                  <li>Intégration: {p.integration || "—"} • Segment: {p.segment || "—"}</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      )}

      {/* ——— PANNEAU CLIENT/DOSSIER INLINE (bouton Voir plus) ——— */}
      {open && (
        <div className="mt-2 border-l-2 pl-4">
          {loading && <div className="text-sm text-gray-500">Chargement…</div>}
          {err && <div className="text-sm text-red-600">❌ {err}</div>}

          {details && (
            <div className="space-y-6">
              {/* 👥 Suivi des clients (mini résumé) */}
              <section className="bg-gray-50 rounded p-3">
                <h4 className="font-semibold mb-2">👥 Suivi des clients</h4>
                <div className="text-sm">
                  <div>
                    <b>{safe(details.client?.prenom)} {safe(details.client?.nom)}</b>{" — "}{safe(details.client?.email)}
                    {details.client?.telephone ? ` • ${details.client.telephone}` : ""}
                  </div>
                  <div className="text-gray-600">
                    Dossier #{dossier.id} — statut {dossier.statut} — créé {dossier.date_creation} — commission {euro(dossier.commission_partenaire_eur)}
                  </div>
                </div>
              </section>

              {/* ⏱️ Timeline du dossier courant */}
              <DossierTimeline dossier={(details.dossiers || []).find(dd => dd.id === dossier.id) || dossier} />

              {/* 📨 Historique (relances & notifications) */}
              <section>
                <h4 className="font-semibold mb-2">📨 Historique (relances & notifications)</h4>
                <CommsHistory
                  communications={details.communications || details.historique_echanges || []}
                  relances={details.relances || []}
                  notifications={details.notifications || []}
                  compact
                />
              </section>

              {/* 💬 Messagerie client */}
              <ClientMessaging clientId={dossier.clientId} dossiers={details.dossiers || []} />

              {/* 🆔 Identité & adresses */}
              <section>
                <h4 className="font-semibold mb-2">🆔 Identité & adresses</h4>
                <ClientIdentityCard client={details.client} />
              </section>

              {/* 📄 Pièces justificatives (+ téléchargements) */}
              <section>
                <h4 className="font-semibold mb-2">📄 Pièces justificatives</h4>
                <PiecesJustificativesCard
                  pieces={details.pieces_justificatives || []}
                  downloads={details.telechargements_disponibles || []}
                />
              </section>

              {/* 🏢 Mon entreprise — réutilise ton composant complet */}
              <section className="bg-gray-50 rounded p-3">
                <h4 className="font-semibold mb-2">🏢 Mon entreprise</h4>
                {entrepriseCardLoading && <div className="text-sm text-gray-500">Chargement…</div>}
                {entrepriseCardErr && <div className="text-sm text-red-600">❌ {entrepriseCardErr}</div>}
                {entrepriseCard ? (
                  <EntrepriseCard data={entrepriseCard} />
                ) : (
                  !entrepriseCardLoading && <div className="text-sm text-gray-500">—</div>
                )}
              </section>

            </div>
          )}
        </div>
      )}
    </li>
  );
}
