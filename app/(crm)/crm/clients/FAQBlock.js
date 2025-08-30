"use client";
export default function FAQBlock({ entries }) {
  if (!entries || entries.length === 0) return null;

  // Option : groupé par catégorie
  const groups = entries.reduce((acc, e) => {
    const k = e.category || "Général";
    (acc[k] ||= []).push(e);
    return acc;
  }, {});

  return (
    <section className="bg-white border rounded p-4">
      <h3 className="text-lg font-semibold mb-3">❓ FAQ</h3>
      <div className="space-y-3">
        {Object.entries(groups).map(([cat, rows]) => (
          <div key={cat}>
            <h4 className="font-medium text-gray-700 mb-2">{cat}</h4>
            <div className="space-y-2">
              {rows.map(r => (
                <details key={r.id} className="rounded border p-2">
                  <summary className="cursor-pointer font-medium">{r.question}</summary>
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{r.answer}</div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
