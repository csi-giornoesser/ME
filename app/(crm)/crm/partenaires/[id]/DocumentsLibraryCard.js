// src/app/(crm)/crm/partenaires/[id]/DocumentsLibraryCard.js
"use client";
import { useState } from "react";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const show = (v) => (v ?? v === 0 ? String(v) : "—");

export default function DocumentsLibraryCard({ partnerId, data }) {
  const [open, setOpen] = useState({ contrats: true, technique: false, support: false });
  if (!data?.partenaire) return null;

  const p = data.partenaire;
  const docs = p.docs || {};
  const tech = Array.isArray(docs.documentation_tech) ? docs.documentation_tech : [];

  const Section = ({ k, icon, title, count, children }) => (
    <div>
      <button
        onClick={() => setOpen((s) => ({ ...s, [k]: !s[k] }))}
        className="flex items-center justify-between w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <span>{icon}</span><span className="font-medium">{title}</span>
          {count > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{count}</span>}
        </div>
        <span className={`transition-transform ${open[k] ? "rotate-90" : ""}`}>▶️</span>
      </button>
      {open[k] && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );

  const Item = ({ icon="📄", title, url, description, type, date }) => {
    const available = !!url;
    const onOpen = () => (available ? window.open(url, "_blank", "noopener,noreferrer") : alert("❌ Document non disponible"));
    return (
      <div className={`p-3 border rounded-lg ${available ? "bg-white hover:bg-gray-50" : "bg-gray-50"}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-xl">{icon}</span>
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">{show(title)}</h5>
              {description ? <p className="text-sm text-gray-600 mt-1">{description}</p> : null}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                {type && <span>Type: {type}</span>}
                {date && <span>MAJ: {fmt(date)}</span>}
                {!available && <span className="text-red-600">Non disponible</span>}
              </div>
            </div>
          </div>
          {available && (
            <div className="flex gap-2 ml-3">
              <button onClick={onOpen} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">👁️ Voir</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const contratCount = [docs.contrat_pdf, docs.modalites_collaboration_pdf].filter(Boolean).length;
  const techCount = tech.length;

  return (
    <section className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">📄 Espace documentaire</h3>
        <div className="text-sm text-gray-600">Partenaire: <strong>{show(p.nom)}</strong></div>
      </div>

      <div className="space-y-4">
        <Section k="contrats" icon="📋" title="Contrats de partenariat" count={contratCount}>
          <Item
            icon="📋"
            title="Contrat de partenariat principal"
            url={docs.contrat_pdf}
            description={p.contrat?.conditions_commerciales}
            type="PDF"
            date={p.contrat?.date_signature}
          />
          <Item
            icon="📖"
            title="Modalités de collaboration"
            url={docs.modalites_collaboration_pdf}
            type="PDF"
          />
        </Section>

        <Section k="technique" icon="🔧" title="Documentation technique" count={techCount}>
          {techCount === 0 ? (
            <div className="ml-8 p-3 bg-gray-50 border rounded text-sm text-gray-600">—</div>
          ) : (
            tech.map((d, i) => (
              <Item
                key={i}
                icon="🔧"
                title={d.type || `Document ${i + 1}`}
                url={d.url}
                description={d.description}
                type={d.format}
                date={d.updated_at}
              />
            ))
          )}
        </Section>

        {/* Support/contacts via BDD uniquement si disponible */}
        {(p.referent || Array.isArray(docs.liens_utiles)) && (
          <Section k="support" icon="💬" title="Support & Contact" count={1}>
            {p.referent && (
              <div className="p-4 border rounded-lg bg-green-50 text-sm text-green-700">
                <div className="font-medium text-green-800 mb-2">📞 Contacts</div>
                <div><strong>Référent:</strong> {show(p.referent?.nom)}</div>
                <div><strong>Email:</strong> {show(p.referent?.email)}</div>
                <div><strong>Téléphone:</strong> {show(p.referent?.telephone)}</div>
                {p.referent?.fonction && <div><strong>Fonction:</strong> {p.referent.fonction}</div>}
              </div>
            )}
            {Array.isArray(docs.liens_utiles) && docs.liens_utiles.length > 0 && (
              <div className="p-4 border rounded-lg bg-blue-50 text-sm text-blue-700">
                <div className="font-medium text-blue-800 mb-2">🔗 Liens utiles</div>
                <ul className="list-disc pl-5">
                  {docs.liens_utiles.map((l, i) => (
                    <li key={i}>
                      <button onClick={() => window.open(l.url, "_blank")} className="text-blue-600 underline">
                        {show(l.label || l.url)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}
      </div>

      <div className="mt-6 pt-4 border-t text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <div>
            {docs.last_updated ? <>Dernière mise à jour documents: {fmt(docs.last_updated)}</> : "—"}
          </div>
          <div>Partenaire depuis: {fmt(p.created_at)}</div>
        </div>
      </div>
    </section>
  );
}
