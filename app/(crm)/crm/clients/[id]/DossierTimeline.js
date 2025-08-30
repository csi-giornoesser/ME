"use client";
import { useState, useEffect, useMemo, useCallback } from "react";

/* ---------- Utils globaux (hors composant) ---------- */
const fmt = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : null);
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString("fr-FR") : null);

const STEP_ORDER = [
  "formulaire",
  "pieces",
  "mandat",
  "transmission",
  "traitement",
  "siren",
  "attestation",
];

function computeProgress(steps) {
  const total = steps.length;
  const completed = steps.filter((s) => s.status === "completed").length;
  const raw = total ? (completed / total) * 100 : 0;
  return { completed, total, raw, percent: Math.round(raw) };
}

/* ---------- Composant ---------- */
export default function DossierTimeline({ dossier }) {
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [piecesData, setPiecesData] = useState(null); // { pieces_expected, pieces_state, summary, capabilities }
  const [loadingPieces, setLoadingPieces] = useState(true);
  const [uploadingStep, setUploadingStep] = useState(null);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    if (!dossier?.id) return;
    loadTimelineData();
    loadPiecesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dossier?.id]);

  const loadTimelineData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dossiers/${dossier.id}/timeline`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTimelineData(data);
    } catch (e) {
      console.error("Erreur chargement timeline:", e);
      setError("Impossible de charger les détails du suivi");
    } finally {
      setLoading(false);
    }
  }, [dossier?.id]);

  const loadPiecesData = useCallback(async () => {
    setLoadingPieces(true);
    try {
      const res = await fetch(`/api/dossiers/${dossier.id}/pieces`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPiecesData(data);
    } catch (e) {
      console.error("Erreur chargement pièces:", e);
    } finally {
      setLoadingPieces(false);
    }
  }, [dossier?.id]);

  /* ---------- Helpers pièces / mandat (binaire) ---------- */
  const getPieceState = useCallback(
    (key) => piecesData?.pieces_state?.find((p) => p.piece_key === key),
    [piecesData]
  );
  const getPieceExpected = useCallback(
    (key) => piecesData?.pieces_expected?.find((p) => p.piece_key === key),
    [piecesData]
  );

  const piecesStatus = useMemo(() => {
    if (!piecesData) return "pending";
    const required = new Set(
      (piecesData.pieces_expected || [])
        .filter((p) => p.piece_key !== "MandatSigne" && p.required !== false)
        .map((p) => p.piece_key)
    );
    const states = (piecesData.pieces_state || []).filter((p) => p.piece_key !== "MandatSigne");
    if (states.length === 0) return "pending";
    const allRequiredUploaded = [...required].every((key) => {
      const piece = states.find((p) => p.piece_key === key);
      return piece && (piece.status === "valide" || piece.status === "en_attente");
    });
    return allRequiredUploaded ? "completed" : "pending";
  }, [piecesData]);

  const mandatStatus = useMemo(() => {
    const mandat = getPieceState("MandatSigne");
    if (!mandat) return "pending";
    return mandat.status === "valide" || mandat.status === "en_attente" ? "completed" : "pending";
  }, [getPieceState]);

  /* ---------- Actions ---------- */
  const handleUploadPiece = useCallback(
    async (pieceKey) => {
      if (!dossier?.id || uploadingStep || piecesData?.capabilities?.canUpload === false) return;
      try {
        const input = document.createElement("input");
        input.type = "file";
        const exp = getPieceExpected(pieceKey);
        const acc = Array.isArray(exp?.accept_ext) ? exp.accept_ext : [".pdf", ".jpg", ".jpeg", ".png"];
        input.accept = acc.join(",");
        input.style.display = "none";
        document.body.appendChild(input);

        input.onchange = async (e) => {
          const file = e.target.files?.[0];
          if (!file) return document.body.removeChild(input);
          if (file.size > 10 * 1024 * 1024) {
            alert("❌ Fichier trop volumineux (max 10MB)");
            return document.body.removeChild(input);
          }
          try {
            setUploadingStep(pieceKey);
            const form = new FormData();
            form.append("file", file);
            const res = await fetch(
              `/api/dossiers/${dossier.id}/pieces/${encodeURIComponent(pieceKey)}/upload`,
              { method: "POST", body: form }
            );
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              const code = body?.error_code ? ` [${body.error_code}]` : "";
              throw new Error((body?.error || `HTTP ${res.status}`) + code);
            }
            await loadPiecesData();
            alert("✅ Fichier uploadé avec succès !");
          } catch (err) {
            alert(`❌ Upload échoué: ${err.message}`);
          } finally {
            setUploadingStep(null);
            input.value = "";
            if (document.body.contains(input)) document.body.removeChild(input);
          }
        };

        input.click();
      } catch (error) {
        setUploadingStep(null);
        alert(`❌ Erreur: ${error.message}`);
      }
    },
    [dossier?.id, uploadingStep, piecesData?.capabilities?.canUpload, getPieceExpected, loadPiecesData]
  );

  const handleDownload = useCallback(
    async (documentType) => {
      try {
        const response = await fetch(`/api/dossiers/${dossier.id}/documents/${documentType}/download`);
        if (!response.ok) throw new Error("Document non disponible");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${documentType}_${dossier.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Erreur téléchargement:", error);
        alert("❌ Impossible de télécharger le document");
      }
    },
    [dossier?.id]
  );

  const handleCompleteForm = useCallback(async () => {
    if (!dossier?.id) return;
    try {
      const res = await fetch(`/api/dossiers/${dossier.id}/etapes/formulaire/completer`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      await loadTimelineData();
    } catch (e) {
      alert(`❌ ${e.message || "Erreur"}`);
    }
  }, [dossier?.id, loadTimelineData]);

  /* ---------- Étapes standardisées (lecture API + état pièces/mandat) ---------- */
  const steps = useMemo(() => {
    if (!timelineData) return [];
    const { timeline_steps, documents_officiels } = timelineData;

    // Formulaire
    const formEntry = timeline_steps?.find((s) => s.id === "formulaire");
    const formDone = formEntry?.done ?? Boolean(dossier?.date_creation);
    const formDate = formEntry?.date || dossier?.date_creation || null;
    const formDesc = formDone ? "Vos informations ont été enregistrées" : "Informations à compléter";

    // Pièces
    const regularPieces = (piecesData?.pieces_state || []).filter((p) => p.piece_key !== "MandatSigne");
    const uploadedPieces = regularPieces.filter(
      (p) => p.status === "valide" || p.status === "en_attente"
    );
    const lastPieceUploadDate = uploadedPieces
      .map((p) => p.uploaded_at)
      .filter(Boolean)
      .map((d) => new Date(d).getTime())
      .sort((a, b) => b - a)[0];
    const lastPieceUpload = lastPieceUploadDate ? new Date(lastPieceUploadDate) : null;

    // Mandat
    const mandat = getPieceState("MandatSigne");

    // Transmission & Traitement : on fait confiance à l’API
    const tx = (timeline_steps || []).find((s) => s.id === "transmission");
    const transmissionStatus = tx?.status || "pending";
    const transmissionDate = tx?.date || null;

    const proc = (timeline_steps || []).find((s) => s.id === "processing");
    const traitementStatus = proc?.status || "pending";
    const traitementDate = proc?.date || null;

    return [
      {
        id: "formulaire",
        title: "Formulaire rempli",
        description: formDesc,
        status: formDone ? "completed" : "pending",
        icon: "📝",
        date: formDate,
      },
      {
        id: "pieces",
        title: "Pièces requises",
        description: loadingPieces
          ? "Chargement des pièces…"
          : piecesStatus === "completed"
          ? "Toutes les pièces requises sont envoyées"
          : `${uploadedPieces.length} / ${regularPieces.length} pièces uploadées`,
        status: piecesStatus,
        icon: "📄",
        date: piecesStatus === "completed" ? lastPieceUpload : null,
      },
      {
        id: "mandat",
        title: "Mandat signé",
        description:
          mandatStatus === "completed"
            ? `Mandat uploadé${mandat?.uploaded_at ? " le " + fmtDateTime(mandat.uploaded_at) : ""}`
            : "Mandat à signer",
        status: mandatStatus,
        icon: "✍️",
        date: mandat?.uploaded_at || null,
      },
      {
        id: "transmission",
        title: "Dossier transmis",
        description:
          transmissionStatus === "completed"
            ? "Dossier transmis aux administrations"
            : "En attente de transmission",
        status: transmissionStatus,
        icon: "📤",
        date: transmissionDate,
      },
      {
        id: "traitement",
        title: "Dossier en cours de traitement",
        description: "Vérification par les administrations",
        status: traitementStatus, // on prend le statut API
        icon: "🏛️",
        date: traitementDate,
      },
      {
        id: "siren",
        title: "SIREN attribué",
        description: "Numéro d'identification reçu",
        status: documents_officiels?.some(
          (d) =>
            d.type === "Avis de situation SIRENE" ||
            d.type?.toUpperCase()?.includes("SIRENE") ||
            d.type?.toUpperCase()?.includes("SIREN")
        )
          ? "completed"
          : "pending",
        icon: "🆔",
        date:
          documents_officiels?.find(
            (d) =>
              d.type === "Avis de situation SIRENE" ||
              d.type?.toUpperCase()?.includes("SIRENE") ||
              d.type?.toUpperCase()?.includes("SIREN")
          )?.date || null,
      },
      {
        id: "attestation",
        title: "Attestation à télécharger",
        description: "Tous vos documents sont prêts",
        status:
          documents_officiels?.some((d) => d.type === "Attestation URSSAF" || d.type?.includes("Attestation")) &&
          dossier?.statut === "valide"
            ? "completed"
            : documents_officiels?.some((d) => d.type === "Attestation URSSAF" || d.type?.includes("Attestation"))
            ? "active"
            : "pending",
        icon: "🎉",
        date:
          documents_officiels?.find(
            (d) => d.type === "Attestation URSSAF" || d.type?.includes("Attestation")
          )?.date || null,
      },
    ];
  }, [timelineData, dossier?.date_creation, dossier?.statut, piecesData, loadingPieces, getPieceState, mandatStatus, piecesStatus]);

  /* ---------- Ordre + progression ---------- */
  const orderedSteps = useMemo(() => {
    return [...steps].sort((a, b) => STEP_ORDER.indexOf(a.id) - STEP_ORDER.indexOf(b.id));
  }, [steps]);

  const { completed, total, raw, percent } = useMemo(
    () => computeProgress(orderedSteps),
    [orderedSteps]
  );
  const progressPercent = Math.round(raw);

  /* ---------- Rendu ---------- */
  if (!dossier) {
    return (
      <section className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-3">📍 Suivi de votre dossier</h3>
        <p className="text-gray-600">Aucun dossier sélectionné</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-3">📍 Suivi de votre micro-entreprise</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-600">🔄 Chargement du suivi...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-3">📍 Suivi de votre micro-entreprise</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="text-red-800">❌ {error}</div>
          <button
            onClick={loadTimelineData}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            🔄 Réessayer
          </button>
        </div>
      </section>
    );
  }

  const getStepStyle = (status) => {
    const base = "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium";
    if (status === "completed") return `${base} bg-green-500 text-white`;
    if (status === "active") return `${base} bg-blue-500 text-white animate-pulse`;
    if (status === "warning") return `${base} bg-orange-500 text-white`;
    if (status === "error") return `${base} bg-red-500 text-white`;
    return `${base} bg-gray-300 text-gray-600`;
  };

  const getConnectorStyle = (status) => {
    if (status === "completed" || status === "active") return "bg-green-300";
    if (status === "warning") return "bg-orange-300";
    if (status === "error") return "bg-red-300";
    return "bg-gray-200";
  };

  return (
    <section className="border rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📍 Suivi de votre micro-entreprise</h3>

        {/* DEBUG progression — à retirer en prod */}
        <div className="mb-3 text-xs p-2 rounded border bg-gray-50 text-gray-700">
          <div>
            <b>Calcul progression</b>
          </div>
          <div>
            completed: {completed} / total: {total} → raw: {raw.toFixed(2)}% → affiché: {progressPercent}%
          </div>
          <div className="mt-1">
            {orderedSteps.map((s) => (
              <span key={s.id} className="inline-block mr-2 mt-1 px-2 py-0.5 rounded border">
                {s.id}: <b>{s.status}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="text-sm text-right">
          <span className="font-medium">{progressPercent}% terminé</span>
          <div className="w-32 bg-gray-200 rounded-full h-2 mt-1" aria-hidden="true">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {timelineData?.metrics?.estimated_completion && (
            <div className="text-xs text-gray-600 mt-1">
              Finalisation estimée: {fmt(timelineData.metrics.estimated_completion)}
            </div>
          )}
        </div>
      </div>

      {dossier?.blocages?.length > 0 && (
        <div className="mb-4 p-3 rounded border bg-orange-50 text-orange-800">
          <span className="mr-2">⚠️</span>
          <strong>Action requise :</strong> {dossier.blocages.join(", ")}
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {dossier.statut === "valide" ? "🎉" : dossier.statut === "rejete" ? "❌" : dossier.blocages?.length > 0 ? "⚠️" : "🔄"}
          </span>
          <div className="flex-1">
            <div className="font-semibold text-lg">
              {dossier.statut === "valide"
                ? "Félicitations ! Votre micro-entreprise est créée !"
                : dossier.statut === "rejete"
                ? "Dossier rejeté - Contactez votre conseiller"
                : dossier.blocages?.length > 0
                ? "Action requise de votre part"
                : "Votre dossier est en cours de traitement"}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Statut: <strong>{dossier.statut}</strong> • Dossier #{dossier.id}
            </div>
          </div>
          <button
            onClick={() => {
              loadTimelineData();
              loadPiecesData();
            }}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            disabled={loading || loadingPieces}
            aria-label="Actualiser le suivi"
            aria-busy={loading || loadingPieces}
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* Timeline des étapes */}
      <div className="space-y-6">
        {orderedSteps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={getStepStyle(step.status)}>{step.icon}</div>
              {index < orderedSteps.length - 1 && (
                <div className={`w-1 h-12 mt-2 ${getConnectorStyle(step.status)}`} />
              )}
            </div>

            <div className="flex-1 pb-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-lg">{step.title}</h4>
                {step.date && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded" title={new Date(step.date).toISOString()}>
                    {fmt(step.date)}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-2">{step.description}</p>

              {step.id === "formulaire" && step.status !== "completed" && (
                <button
                  onClick={handleCompleteForm}
                  className="px-3 py-1.5 rounded text-xs font-medium border bg-blue-600 text-white hover:bg-blue-700"
                >
                  ✅ Marquer le formulaire comme fait
                </button>
              )}

              {step.id === "pieces" && !loadingPieces && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {(piecesData?.pieces_state || [])
                      .filter((p) => p.piece_key !== "MandatSigne")
                      .map((p) => {
                        const isUploaded = p.status === "valide" || p.status === "en_attente";
                        const canUpload = piecesData?.capabilities?.canUpload !== false;
                        const disabled = uploadingStep === p.piece_key || p.status === "valide" || !canUpload;

                        const exp = getPieceExpected(p.piece_key);
                        const ext = Array.isArray(exp?.accept_ext) ? exp.accept_ext.join(", ") : "pdf, jpg, png";
                        const title =
                          (p.status === "valide"
                            ? "Validée"
                            : p.status === "en_attente"
                            ? "En revue"
                            : p.status === "refusee"
                            ? `Refusée${p.reason ? " — " + p.reason : ""}`
                            : "À fournir") + ` • Formats: ${ext}`;

                        return (
                          <button
                            key={p.piece_key}
                            onClick={() => handleUploadPiece(p.piece_key)}
                            disabled={disabled}
                            title={title}
                            className={`px-3 py-1.5 rounded text-xs font-medium border transition disabled:opacity-50 ${
                              isUploaded
                                ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
                                : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            {uploadingStep === p.piece_key ? "📤 Envoi…" : p.piece_label || p.piece_key}
                          </button>
                        );
                      })}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500">🟢 Uploadé / en revue • 🔴 À uploader</div>
                </>
              )}

              {step.id === "mandat" && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const m = getPieceState("MandatSigne");
                    const status = m?.status || "missing";
                    const isUploaded = status === "valide" || status === "en_attente";
                    const canUpload = piecesData?.capabilities?.canUpload !== false;
                    const disabled = uploadingStep === "MandatSigne" || status === "valide" || !canUpload;

                    const exp = getPieceExpected("MandatSigne");
                    const ext = Array.isArray(exp?.accept_ext) ? exp.accept_ext.join(", ") : "pdf, jpg, png";
                    const title =
                      (status === "valide"
                        ? "Mandat validé"
                        : status === "en_attente"
                        ? "En revue"
                        : status === "refusee"
                        ? `Refusé${m?.reason ? " — " + m.reason : ""}`
                        : "À fournir") + ` • Formats: ${ext}`;

                    return (
                      <button
                        onClick={() => handleUploadPiece("MandatSigne")}
                        disabled={disabled}
                        title={title}
                        className={`px-3 py-1.5 rounded text-xs font-medium border transition disabled:opacity-50 ${
                          isUploaded
                            ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
                            : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {uploadingStep === "MandatSigne" ? "📤 Envoi…" : isUploaded ? "Mandat ✅" : "Uploader le mandat"}
                      </button>
                    );
                  })()}
                </div>
              )}

              {step.id === "siren" && step.status === "completed" && (
                <div className="mt-2">
                  <button
                    onClick={() => handleDownload("sirene")}
                    className="px-3 py-1.5 rounded text-xs font-semibold bg-green-600 text-white hover:bg-green-700"
                  >
                    📥 Télécharger l'avis SIRENE
                  </button>
                </div>
              )}

              {step.id === "attestation" && step.status === "completed" && (
                <div className="mt-2">
                  <button
                    onClick={() => handleDownload("attestation")}
                    className="px-3 py-1.5 rounded text-xs font-semibold bg-green-600 text-white hover:bg-green-700"
                  >
                    📥 Télécharger l'attestation
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Métriques */}
      <div className="mt-4 pt-3 border-t bg-gray-50 -m-4 p-4 rounded-b">
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Créé le:</span>
            <br />
            {fmt(dossier.date_creation)}
          </div>
          <div>
            <span className="font-medium">Dernière MAJ:</span>
            <br />
            {fmt(dossier.derniere_modification)}
          </div>
          <div>
            <span className="font-medium">Documents générés:</span>
            <br />
            {timelineData?.metrics?.documents_officiels_count || 0}
          </div>
          <div>
            <span className="font-medium">Référence:</span>
            <br />#{dossier.id}
          </div>
        </div>
      </div>
    </section>
  );
}
