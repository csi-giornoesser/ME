import fs from "fs";
import path from "path";

const p = path.join(process.cwd(), "public", "mockData.json");
const raw = fs.readFileSync(p, "utf-8");
const data = JSON.parse(raw);

const errs = [];

const arr = (x) => Array.isArray(x) ? x : [];
const valEnum = (v, allowed, ctx) => { if (v != null && !allowed.includes(v)) errs.push(`${ctx}: "${v}" ∉ ${JSON.stringify(allowed)}`); };

const clients = new Map(arr(data.clients).map(c => [String(c.id), c]));
const entreprises = new Map(arr(data.entreprises).map(e => [String(e.id), e]));
const partenaires = new Map(arr(data.partenaires).map(p => [String(p.id), p]));
const operateurs = new Map(arr(data.operateurs).map(o => [String(o.id), o]));

const dossiers = arr(data.dossiers);
const tickets = arr(data.tickets);
const emails = arr(data.emails_automatiques);
const partnerUsers = arr(data.partner_users);
const exportsHist = arr(data.partner_exports_history);
const notifs = arr(data.notifications_queue);

const STATUTS_DOSSIER = arr(data.refs?.statuts_dossier);
const STATUTS_TICKET = arr(data.refs?.statuts_ticket);

// Dossiers → refs
for (const d of dossiers) {
  if (!clients.has(String(d.clientId))) errs.push(`dossier#${d.id}: clientId ${d.clientId} inexistant`);
  if (!entreprises.has(String(d.entrepriseId))) errs.push(`dossier#${d.id}: entrepriseId ${d.entrepriseId} inexistant`);
  if (!partenaires.has(String(d.partenaireId))) errs.push(`dossier#${d.id}: partenaireId ${d.partenaireId} inexistant`);
  if (!operateurs.has(String(d.operateurId))) errs.push(`dossier#${d.id}: operateurId ${d.operateurId} inexistant`);
  if (STATUTS_DOSSIER.length) valEnum(d.statut, STATUTS_DOSSIER, `dossier#${d.id}.statut`);
}

// Client ↔ Entreprise
for (const c of clients.values()) {
  if (!entreprises.has(String(c.entrepriseId))) errs.push(`client#${c.id}: entrepriseId ${c.entrepriseId} inexistant`);
}
for (const e of entreprises.values()) {
  if (!clients.has(String(e.titulaireClientId))) errs.push(`entreprise#${e.id}: titulaireClientId ${e.titulaireClientId} inexistant`);
}

// Tickets
for (const t of tickets) {
  if (!dossiers.find(d => String(d.id) === String(t.dossierId))) errs.push(`ticket#${t.id}: dossierId ${t.dossierId} inexistant`);
  if (STATUTS_TICKET.length) valEnum(t.statut, STATUTS_TICKET, `ticket#${t.id}.statut`);
}

// Emails auto
for (const m of emails) {
  if (!clients.has(String(m.clientId))) errs.push(`email:${m.type}: clientId ${m.clientId} inexistant`);
  if (!dossiers.find(d => String(d.id) === String(m.dossierId))) errs.push(`email:${m.type}: dossierId ${m.dossierId} inexistant`);
}

// Partner users / exports
for (const u of partnerUsers) {
  if (!partenaires.has(String(u.partnerId))) errs.push(`partner_user#${u.id}: partnerId ${u.partnerId} inexistant`);
}
for (const ex of exportsHist) {
  if (!partenaires.has(String(ex.partnerId))) errs.push(`export#${ex.id}: partnerId ${ex.partnerId} inexistant`);
}

// Notifs
for (const n of notifs) {
  if (!clients.has(String(n.clientId))) errs.push(`notif#${n.id}: clientId ${n.clientId} inexistant`);
  if (!dossiers.find(d => String(d.id) === String(n.dossierId))) errs.push(`notif#${n.id}: dossierId ${n.dossierId} inexistant`);
}

if (errs.length) {
  console.error("❌ Mock invalide :");
  for (const e of errs) console.error(" -", e);
  process.exit(1);
}
console.log("✅ Mock OK (références et enums basiques).");
