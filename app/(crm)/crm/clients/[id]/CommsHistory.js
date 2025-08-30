"use client";

export default function NotificationsRelancesCard({ relances = [], notifications = [] }) {
  // Fusionner relances + notifications
  let items = [...relances, ...notifications];

  // Trier par date décroissante
  items = items.sort(
    (a, b) =>
      (new Date(b.scheduled_for).getTime() || 0) -
      (new Date(a.scheduled_for).getTime() || 0)
  );

  if (!items.length) {
    return (
      <section className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-3">📨 Historique (relances & notifications)</h3>
        <p className="text-gray-500 text-sm">
          Aucune relance ou notification programmée.
        </p>
      </section>
    );
  }

  // Badge couleur selon le type
  const badge = (type) => {
    if (type.startsWith("relance")) {
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800">
          Relance
        </span>
      );
    }
    return (
      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
        Notification
      </span>
    );
  };

  // Format date
  const fmt = (d) => (d ? new Date(d).toLocaleString("fr-FR") : "—");

  return (
    <section className="bg-white border rounded p-4">
      <h3 className="text-lg font-semibold mb-3">📨 Historique (relances & notifications)</h3>
      <ul className="space-y-3">
        {items.map((x) => (
          <li key={x.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {badge(x.type)}
                <span className="text-sm text-gray-600">
                  {x.canal || "—"}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {fmt(x.scheduled_for)}
              </div>
            </div>

            {x.message && x.message.trim() !== "" ? (
              <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                {x.message}
              </div>
            ) : (
              <div className="mt-1 text-sm text-gray-400 italic">
                Aucun message
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
