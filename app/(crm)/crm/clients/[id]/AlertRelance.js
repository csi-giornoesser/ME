"use client";
export default function ClientRelancesAlert({ alert }) {
  if (!alert) return null;

  const hasText = (s) => typeof s === "string" && s.trim() !== "";
  const txt = hasText(alert.subject) ? alert.subject : hasText(alert.note) ? alert.note : "";
  if (!hasText(txt)) return null; // n’affiche rien si relance “vide”

  const when = alert.at ? new Date(alert.at).toLocaleString("fr-FR") : "—";
  const canal = alert.canal || "—";

  return (
    <div className="border rounded-md p-3 bg-amber-50 border-amber-200">
      <div className="flex items-start gap-3">
        <div className="text-xl">⏰</div>
        <div className="flex-1">
          <div className="font-semibold">
            Relance reçue ({canal}) — {when}
          </div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {txt}
          </div>
        </div>
      </div>
    </div>
  );
}
