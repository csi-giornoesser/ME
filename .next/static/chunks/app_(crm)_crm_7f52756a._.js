(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>DossierTimeline
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
/* ---------- Utils globaux (hors composant) ---------- */ const fmt = (d)=>d ? new Date(d).toLocaleDateString("fr-FR") : null;
const fmtDateTime = (d)=>d ? new Date(d).toLocaleString("fr-FR") : null;
const STEP_ORDER = [
    "formulaire",
    "pieces",
    "mandat",
    "transmission",
    "traitement",
    "siren",
    "attestation"
];
function computeProgress(steps) {
    const total = steps.length;
    const completed = steps.filter((s)=>s.status === "completed").length;
    const raw = total ? completed / total * 100 : 0;
    return {
        completed,
        total,
        raw,
        percent: Math.round(raw)
    };
}
function DossierTimeline(param) {
    let { dossier } = param;
    var _piecesData_capabilities, _timelineData_metrics, _dossier_blocages, _dossier_blocages1, _dossier_blocages2, _timelineData_metrics1;
    _s();
    const [timelineData, setTimelineData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [piecesData, setPiecesData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // { pieces_expected, pieces_state, summary, capabilities }
    const [loadingPieces, setLoadingPieces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [uploadingStep, setUploadingStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /* ---------- Fetch ---------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DossierTimeline.useEffect": ()=>{
            if (!(dossier === null || dossier === void 0 ? void 0 : dossier.id)) return;
            loadTimelineData();
            loadPiecesData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["DossierTimeline.useEffect"], [
        dossier === null || dossier === void 0 ? void 0 : dossier.id
    ]);
    const loadTimelineData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DossierTimeline.useCallback[loadTimelineData]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/dossiers/".concat(dossier.id, "/timeline"), {
                    cache: "no-store"
                });
                if (!res.ok) throw new Error("HTTP ".concat(res.status));
                const data = await res.json();
                setTimelineData(data);
            } catch (e) {
                console.error("Erreur chargement timeline:", e);
                setError("Impossible de charger les détails du suivi");
            } finally{
                setLoading(false);
            }
        }
    }["DossierTimeline.useCallback[loadTimelineData]"], [
        dossier === null || dossier === void 0 ? void 0 : dossier.id
    ]);
    const loadPiecesData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DossierTimeline.useCallback[loadPiecesData]": async ()=>{
            setLoadingPieces(true);
            try {
                const res = await fetch("/api/dossiers/".concat(dossier.id, "/pieces"), {
                    cache: "no-store"
                });
                if (!res.ok) throw new Error("HTTP ".concat(res.status));
                const data = await res.json();
                setPiecesData(data);
            } catch (e) {
                console.error("Erreur chargement pièces:", e);
            } finally{
                setLoadingPieces(false);
            }
        }
    }["DossierTimeline.useCallback[loadPiecesData]"], [
        dossier === null || dossier === void 0 ? void 0 : dossier.id
    ]);
    /* ---------- Helpers pièces / mandat (binaire) ---------- */ const getPieceState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DossierTimeline.useCallback[getPieceState]": (key)=>{
            var _piecesData_pieces_state;
            return piecesData === null || piecesData === void 0 ? void 0 : (_piecesData_pieces_state = piecesData.pieces_state) === null || _piecesData_pieces_state === void 0 ? void 0 : _piecesData_pieces_state.find({
                "DossierTimeline.useCallback[getPieceState]": (p)=>p.piece_key === key
            }["DossierTimeline.useCallback[getPieceState]"]);
        }
    }["DossierTimeline.useCallback[getPieceState]"], [
        piecesData
    ]);
    const getPieceExpected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DossierTimeline.useCallback[getPieceExpected]": (key)=>{
            var _piecesData_pieces_expected;
            return piecesData === null || piecesData === void 0 ? void 0 : (_piecesData_pieces_expected = piecesData.pieces_expected) === null || _piecesData_pieces_expected === void 0 ? void 0 : _piecesData_pieces_expected.find({
                "DossierTimeline.useCallback[getPieceExpected]": (p)=>p.piece_key === key
            }["DossierTimeline.useCallback[getPieceExpected]"]);
        }
    }["DossierTimeline.useCallback[getPieceExpected]"], [
        piecesData
    ]);
    const piecesStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DossierTimeline.useMemo[piecesStatus]": ()=>{
            if (!piecesData) return "pending";
            const required = new Set((piecesData.pieces_expected || []).filter({
                "DossierTimeline.useMemo[piecesStatus]": (p)=>p.piece_key !== "MandatSigne" && p.required !== false
            }["DossierTimeline.useMemo[piecesStatus]"]).map({
                "DossierTimeline.useMemo[piecesStatus]": (p)=>p.piece_key
            }["DossierTimeline.useMemo[piecesStatus]"]));
            const states = (piecesData.pieces_state || []).filter({
                "DossierTimeline.useMemo[piecesStatus].states": (p)=>p.piece_key !== "MandatSigne"
            }["DossierTimeline.useMemo[piecesStatus].states"]);
            if (states.length === 0) return "pending";
            const allRequiredUploaded = [
                ...required
            ].every({
                "DossierTimeline.useMemo[piecesStatus].allRequiredUploaded": (key)=>{
                    const piece = states.find({
                        "DossierTimeline.useMemo[piecesStatus].allRequiredUploaded.piece": (p)=>p.piece_key === key
                    }["DossierTimeline.useMemo[piecesStatus].allRequiredUploaded.piece"]);
                    return piece && (piece.status === "valide" || piece.status === "en_attente");
                }
            }["DossierTimeline.useMemo[piecesStatus].allRequiredUploaded"]);
            return allRequiredUploaded ? "completed" : "pending";
        }
    }["DossierTimeline.useMemo[piecesStatus]"], [
        piecesData
    ]);
    const mandatStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DossierTimeline.useMemo[mandatStatus]": ()=>{
            const mandat = getPieceState("MandatSigne");
            if (!mandat) return "pending";
            return mandat.status === "valide" || mandat.status === "en_attente" ? "completed" : "pending";
        }
    }["DossierTimeline.useMemo[mandatStatus]"], [
        getPieceState
    ]);
    /* ---------- Actions ---------- */ const handleUploadPiece = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DossierTimeline.useCallback[handleUploadPiece]": async (pieceKey)=>{
            var _piecesData_capabilities;
            if (!(dossier === null || dossier === void 0 ? void 0 : dossier.id) || uploadingStep || (piecesData === null || piecesData === void 0 ? void 0 : (_piecesData_capabilities = piecesData.capabilities) === null || _piecesData_capabilities === void 0 ? void 0 : _piecesData_capabilities.canUpload) === false) return;
            try {
                const input = document.createElement("input");
                input.type = "file";
                const exp = getPieceExpected(pieceKey);
                const acc = Array.isArray(exp === null || exp === void 0 ? void 0 : exp.accept_ext) ? exp.accept_ext : [
                    ".pdf",
                    ".jpg",
                    ".jpeg",
                    ".png"
                ];
                input.accept = acc.join(",");
                input.style.display = "none";
                document.body.appendChild(input);
                input.onchange = ({
                    "DossierTimeline.useCallback[handleUploadPiece]": async (e)=>{
                        var _e_target_files;
                        const file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
                        if (!file) return document.body.removeChild(input);
                        if (file.size > 10 * 1024 * 1024) {
                            alert("❌ Fichier trop volumineux (max 10MB)");
                            return document.body.removeChild(input);
                        }
                        try {
                            setUploadingStep(pieceKey);
                            const form = new FormData();
                            form.append("file", file);
                            const res = await fetch("/api/dossiers/".concat(dossier.id, "/pieces/").concat(encodeURIComponent(pieceKey), "/upload"), {
                                method: "POST",
                                body: form
                            });
                            if (!res.ok) {
                                const body = await res.json().catch({
                                    "DossierTimeline.useCallback[handleUploadPiece]": ()=>({})
                                }["DossierTimeline.useCallback[handleUploadPiece]"]);
                                const code = (body === null || body === void 0 ? void 0 : body.error_code) ? " [".concat(body.error_code, "]") : "";
                                throw new Error(((body === null || body === void 0 ? void 0 : body.error) || "HTTP ".concat(res.status)) + code);
                            }
                            await loadPiecesData();
                            alert("✅ Fichier uploadé avec succès !");
                        } catch (err) {
                            alert("❌ Upload échoué: ".concat(err.message));
                        } finally{
                            setUploadingStep(null);
                            input.value = "";
                            if (document.body.contains(input)) document.body.removeChild(input);
                        }
                    }
                })["DossierTimeline.useCallback[handleUploadPiece]"];
                input.click();
            } catch (error) {
                setUploadingStep(null);
                alert("❌ Erreur: ".concat(error.message));
            }
        }
    }["DossierTimeline.useCallback[handleUploadPiece]"], [
        dossier === null || dossier === void 0 ? void 0 : dossier.id,
        uploadingStep,
        piecesData === null || piecesData === void 0 ? void 0 : (_piecesData_capabilities = piecesData.capabilities) === null || _piecesData_capabilities === void 0 ? void 0 : _piecesData_capabilities.canUpload,
        getPieceExpected,
        loadPiecesData
    ]);
    const handleDownload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DossierTimeline.useCallback[handleDownload]": async (documentType)=>{
            try {
                const response = await fetch("/api/dossiers/".concat(dossier.id, "/documents/").concat(documentType, "/download"));
                if (!response.ok) throw new Error("Document non disponible");
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "".concat(documentType, "_").concat(dossier.id, ".pdf");
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (error) {
                console.error("Erreur téléchargement:", error);
                alert("❌ Impossible de télécharger le document");
            }
        }
    }["DossierTimeline.useCallback[handleDownload]"], [
        dossier === null || dossier === void 0 ? void 0 : dossier.id
    ]);
    const handleCompleteForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DossierTimeline.useCallback[handleCompleteForm]": async ()=>{
            if (!(dossier === null || dossier === void 0 ? void 0 : dossier.id)) return;
            try {
                const res = await fetch("/api/dossiers/".concat(dossier.id, "/etapes/formulaire/completer"), {
                    method: "POST"
                });
                if (!res.ok) {
                    const body = await res.json().catch({
                        "DossierTimeline.useCallback[handleCompleteForm]": ()=>({})
                    }["DossierTimeline.useCallback[handleCompleteForm]"]);
                    throw new Error((body === null || body === void 0 ? void 0 : body.error) || "HTTP ".concat(res.status));
                }
                await loadTimelineData();
            } catch (e) {
                alert("❌ ".concat(e.message || "Erreur"));
            }
        }
    }["DossierTimeline.useCallback[handleCompleteForm]"], [
        dossier === null || dossier === void 0 ? void 0 : dossier.id,
        loadTimelineData
    ]);
    /* ---------- Étapes standardisées (lecture API + état pièces/mandat) ---------- */ const steps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DossierTimeline.useMemo[steps]": ()=>{
            var _documents_officiels_find, _documents_officiels_find1;
            if (!timelineData) return [];
            const { timeline_steps, documents_officiels } = timelineData;
            // Formulaire
            const formEntry = timeline_steps === null || timeline_steps === void 0 ? void 0 : timeline_steps.find({
                "DossierTimeline.useMemo[steps]": (s)=>s.id === "formulaire"
            }["DossierTimeline.useMemo[steps]"]);
            var _formEntry_done;
            const formDone = (_formEntry_done = formEntry === null || formEntry === void 0 ? void 0 : formEntry.done) !== null && _formEntry_done !== void 0 ? _formEntry_done : Boolean(dossier === null || dossier === void 0 ? void 0 : dossier.date_creation);
            const formDate = (formEntry === null || formEntry === void 0 ? void 0 : formEntry.date) || (dossier === null || dossier === void 0 ? void 0 : dossier.date_creation) || null;
            const formDesc = formDone ? "Vos informations ont été enregistrées" : "Informations à compléter";
            // Pièces
            const regularPieces = ((piecesData === null || piecesData === void 0 ? void 0 : piecesData.pieces_state) || []).filter({
                "DossierTimeline.useMemo[steps].regularPieces": (p)=>p.piece_key !== "MandatSigne"
            }["DossierTimeline.useMemo[steps].regularPieces"]);
            const uploadedPieces = regularPieces.filter({
                "DossierTimeline.useMemo[steps].uploadedPieces": (p)=>p.status === "valide" || p.status === "en_attente"
            }["DossierTimeline.useMemo[steps].uploadedPieces"]);
            const lastPieceUploadDate = uploadedPieces.map({
                "DossierTimeline.useMemo[steps]": (p)=>p.uploaded_at
            }["DossierTimeline.useMemo[steps]"]).filter(Boolean).map({
                "DossierTimeline.useMemo[steps]": (d)=>new Date(d).getTime()
            }["DossierTimeline.useMemo[steps]"]).sort({
                "DossierTimeline.useMemo[steps]": (a, b)=>b - a
            }["DossierTimeline.useMemo[steps]"])[0];
            const lastPieceUpload = lastPieceUploadDate ? new Date(lastPieceUploadDate) : null;
            // Mandat
            const mandat = getPieceState("MandatSigne");
            // Transmission & Traitement : on fait confiance à l’API
            const tx = (timeline_steps || []).find({
                "DossierTimeline.useMemo[steps].tx": (s)=>s.id === "transmission"
            }["DossierTimeline.useMemo[steps].tx"]);
            const transmissionStatus = (tx === null || tx === void 0 ? void 0 : tx.status) || "pending";
            const transmissionDate = (tx === null || tx === void 0 ? void 0 : tx.date) || null;
            const proc = (timeline_steps || []).find({
                "DossierTimeline.useMemo[steps].proc": (s)=>s.id === "processing"
            }["DossierTimeline.useMemo[steps].proc"]);
            const traitementStatus = (proc === null || proc === void 0 ? void 0 : proc.status) || "pending";
            const traitementDate = (proc === null || proc === void 0 ? void 0 : proc.date) || null;
            return [
                {
                    id: "formulaire",
                    title: "Formulaire rempli",
                    description: formDesc,
                    status: formDone ? "completed" : "pending",
                    icon: "📝",
                    date: formDate
                },
                {
                    id: "pieces",
                    title: "Pièces requises",
                    description: loadingPieces ? "Chargement des pièces…" : piecesStatus === "completed" ? "Toutes les pièces requises sont envoyées" : "".concat(uploadedPieces.length, " / ").concat(regularPieces.length, " pièces uploadées"),
                    status: piecesStatus,
                    icon: "📄",
                    date: piecesStatus === "completed" ? lastPieceUpload : null
                },
                {
                    id: "mandat",
                    title: "Mandat signé",
                    description: mandatStatus === "completed" ? "Mandat uploadé".concat((mandat === null || mandat === void 0 ? void 0 : mandat.uploaded_at) ? " le " + fmtDateTime(mandat.uploaded_at) : "") : "Mandat à signer",
                    status: mandatStatus,
                    icon: "✍️",
                    date: (mandat === null || mandat === void 0 ? void 0 : mandat.uploaded_at) || null
                },
                {
                    id: "transmission",
                    title: "Dossier transmis",
                    description: transmissionStatus === "completed" ? "Dossier transmis aux administrations" : "En attente de transmission",
                    status: transmissionStatus,
                    icon: "📤",
                    date: transmissionDate
                },
                {
                    id: "traitement",
                    title: "Dossier en cours de traitement",
                    description: "Vérification par les administrations",
                    status: traitementStatus,
                    icon: "🏛️",
                    date: traitementDate
                },
                {
                    id: "siren",
                    title: "SIREN attribué",
                    description: "Numéro d'identification reçu",
                    status: (documents_officiels === null || documents_officiels === void 0 ? void 0 : documents_officiels.some({
                        "DossierTimeline.useMemo[steps]": (d)=>{
                            var _d_type_toUpperCase, _d_type, _d_type_toUpperCase1, _d_type1;
                            return d.type === "Avis de situation SIRENE" || ((_d_type = d.type) === null || _d_type === void 0 ? void 0 : (_d_type_toUpperCase = _d_type.toUpperCase()) === null || _d_type_toUpperCase === void 0 ? void 0 : _d_type_toUpperCase.includes("SIRENE")) || ((_d_type1 = d.type) === null || _d_type1 === void 0 ? void 0 : (_d_type_toUpperCase1 = _d_type1.toUpperCase()) === null || _d_type_toUpperCase1 === void 0 ? void 0 : _d_type_toUpperCase1.includes("SIREN"));
                        }
                    }["DossierTimeline.useMemo[steps]"])) ? "completed" : "pending",
                    icon: "🆔",
                    date: (documents_officiels === null || documents_officiels === void 0 ? void 0 : (_documents_officiels_find = documents_officiels.find({
                        "DossierTimeline.useMemo[steps]": (d)=>{
                            var _d_type_toUpperCase, _d_type, _d_type_toUpperCase1, _d_type1;
                            return d.type === "Avis de situation SIRENE" || ((_d_type = d.type) === null || _d_type === void 0 ? void 0 : (_d_type_toUpperCase = _d_type.toUpperCase()) === null || _d_type_toUpperCase === void 0 ? void 0 : _d_type_toUpperCase.includes("SIRENE")) || ((_d_type1 = d.type) === null || _d_type1 === void 0 ? void 0 : (_d_type_toUpperCase1 = _d_type1.toUpperCase()) === null || _d_type_toUpperCase1 === void 0 ? void 0 : _d_type_toUpperCase1.includes("SIREN"));
                        }
                    }["DossierTimeline.useMemo[steps]"])) === null || _documents_officiels_find === void 0 ? void 0 : _documents_officiels_find.date) || null
                },
                {
                    id: "attestation",
                    title: "Attestation à télécharger",
                    description: "Tous vos documents sont prêts",
                    status: (documents_officiels === null || documents_officiels === void 0 ? void 0 : documents_officiels.some({
                        "DossierTimeline.useMemo[steps]": (d)=>{
                            var _d_type;
                            return d.type === "Attestation URSSAF" || ((_d_type = d.type) === null || _d_type === void 0 ? void 0 : _d_type.includes("Attestation"));
                        }
                    }["DossierTimeline.useMemo[steps]"])) && (dossier === null || dossier === void 0 ? void 0 : dossier.statut) === "valide" ? "completed" : (documents_officiels === null || documents_officiels === void 0 ? void 0 : documents_officiels.some({
                        "DossierTimeline.useMemo[steps]": (d)=>{
                            var _d_type;
                            return d.type === "Attestation URSSAF" || ((_d_type = d.type) === null || _d_type === void 0 ? void 0 : _d_type.includes("Attestation"));
                        }
                    }["DossierTimeline.useMemo[steps]"])) ? "active" : "pending",
                    icon: "🎉",
                    date: (documents_officiels === null || documents_officiels === void 0 ? void 0 : (_documents_officiels_find1 = documents_officiels.find({
                        "DossierTimeline.useMemo[steps]": (d)=>{
                            var _d_type;
                            return d.type === "Attestation URSSAF" || ((_d_type = d.type) === null || _d_type === void 0 ? void 0 : _d_type.includes("Attestation"));
                        }
                    }["DossierTimeline.useMemo[steps]"])) === null || _documents_officiels_find1 === void 0 ? void 0 : _documents_officiels_find1.date) || null
                }
            ];
        }
    }["DossierTimeline.useMemo[steps]"], [
        timelineData,
        dossier === null || dossier === void 0 ? void 0 : dossier.date_creation,
        dossier === null || dossier === void 0 ? void 0 : dossier.statut,
        piecesData,
        loadingPieces,
        getPieceState,
        mandatStatus,
        piecesStatus
    ]);
    /* ---------- Ordre + progression ---------- */ const orderedSteps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DossierTimeline.useMemo[orderedSteps]": ()=>{
            return [
                ...steps
            ].sort({
                "DossierTimeline.useMemo[orderedSteps]": (a, b)=>STEP_ORDER.indexOf(a.id) - STEP_ORDER.indexOf(b.id)
            }["DossierTimeline.useMemo[orderedSteps]"]);
        }
    }["DossierTimeline.useMemo[orderedSteps]"], [
        steps
    ]);
    const { completed, total, raw, percent } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DossierTimeline.useMemo": ()=>computeProgress(orderedSteps)
    }["DossierTimeline.useMemo"], [
        orderedSteps
    ]);
    const progressPercent = Math.round(raw);
    /* ---------- Rendu ---------- */ if (!dossier) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "border rounded p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-3",
                    children: "📍 Suivi de votre dossier"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                    lineNumber: 336,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600",
                    children: "Aucun dossier sélectionné"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                    lineNumber: 337,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
            lineNumber: 335,
            columnNumber: 7
        }, this);
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "border rounded p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-3",
                    children: "📍 Suivi de votre micro-entreprise"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                    lineNumber: 345,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-600",
                        children: "🔄 Chargement du suivi..."
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                        lineNumber: 347,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                    lineNumber: 346,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
            lineNumber: 344,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "border rounded p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-3",
                    children: "📍 Suivi de votre micro-entreprise"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                    lineNumber: 356,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-50 border border-red-200 rounded p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-800",
                            children: [
                                "❌ ",
                                error
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 358,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: loadTimelineData,
                            className: "mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700",
                            children: "🔄 Réessayer"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 359,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                    lineNumber: 357,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
            lineNumber: 355,
            columnNumber: 7
        }, this);
    }
    const getStepStyle = (status)=>{
        const base = "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium";
        if (status === "completed") return "".concat(base, " bg-green-500 text-white");
        if (status === "active") return "".concat(base, " bg-blue-500 text-white animate-pulse");
        if (status === "warning") return "".concat(base, " bg-orange-500 text-white");
        if (status === "error") return "".concat(base, " bg-red-500 text-white");
        return "".concat(base, " bg-gray-300 text-gray-600");
    };
    const getConnectorStyle = (status)=>{
        if (status === "completed" || status === "active") return "bg-green-300";
        if (status === "warning") return "bg-orange-300";
        if (status === "error") return "bg-red-300";
        return "bg-gray-200";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "border rounded p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold",
                        children: "📍 Suivi de votre micro-entreprise"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                        lineNumber: 389,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 text-xs p-2 rounded border bg-gray-50 text-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                    children: "Calcul progression"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 394,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                lineNumber: 393,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "completed: ",
                                    completed,
                                    " / total: ",
                                    total,
                                    " → raw: ",
                                    raw.toFixed(2),
                                    "% → affiché: ",
                                    progressPercent,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                lineNumber: 396,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1",
                                children: orderedSteps.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block mr-2 mt-1 px-2 py-0.5 rounded border",
                                        children: [
                                            s.id,
                                            ": ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: s.status
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                                lineNumber: 402,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, s.id, true, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 401,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                        lineNumber: 392,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: [
                                    progressPercent,
                                    "% terminé"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                lineNumber: 409,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-32 bg-gray-200 rounded-full h-2 mt-1",
                                "aria-hidden": "true",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-600 h-2 rounded-full transition-all duration-300",
                                    style: {
                                        width: "".concat(progressPercent, "%")
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 411,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                lineNumber: 410,
                                columnNumber: 11
                            }, this),
                            (timelineData === null || timelineData === void 0 ? void 0 : (_timelineData_metrics = timelineData.metrics) === null || _timelineData_metrics === void 0 ? void 0 : _timelineData_metrics.estimated_completion) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-600 mt-1",
                                children: [
                                    "Finalisation estimée: ",
                                    fmt(timelineData.metrics.estimated_completion)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                lineNumber: 417,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                        lineNumber: 408,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                lineNumber: 388,
                columnNumber: 7
            }, this),
            (dossier === null || dossier === void 0 ? void 0 : (_dossier_blocages = dossier.blocages) === null || _dossier_blocages === void 0 ? void 0 : _dossier_blocages.length) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 p-3 rounded border bg-orange-50 text-orange-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mr-2",
                        children: "⚠️"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                        lineNumber: 426,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Action requise :"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                        lineNumber: 427,
                        columnNumber: 11
                    }, this),
                    " ",
                    dossier.blocages.join(", ")
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                lineNumber: 425,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 p-4 bg-blue-50 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-2xl",
                            children: dossier.statut === "valide" ? "🎉" : dossier.statut === "rejete" ? "❌" : ((_dossier_blocages1 = dossier.blocages) === null || _dossier_blocages1 === void 0 ? void 0 : _dossier_blocages1.length) > 0 ? "⚠️" : "🔄"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 433,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-semibold text-lg",
                                    children: dossier.statut === "valide" ? "Félicitations ! Votre micro-entreprise est créée !" : dossier.statut === "rejete" ? "Dossier rejeté - Contactez votre conseiller" : ((_dossier_blocages2 = dossier.blocages) === null || _dossier_blocages2 === void 0 ? void 0 : _dossier_blocages2.length) > 0 ? "Action requise de votre part" : "Votre dossier est en cours de traitement"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 437,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-600 mt-1",
                                    children: [
                                        "Statut: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: dossier.statut
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                            lineNumber: 447,
                                            columnNumber: 23
                                        }, this),
                                        " • Dossier #",
                                        dossier.id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 446,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 436,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                loadTimelineData();
                                loadPiecesData();
                            },
                            className: "text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700",
                            disabled: loading || loadingPieces,
                            "aria-label": "Actualiser le suivi",
                            "aria-busy": loading || loadingPieces,
                            children: "🔄 Actualiser"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 450,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                    lineNumber: 432,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                lineNumber: 431,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: orderedSteps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: getStepStyle(step.status),
                                        children: step.icon
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 470,
                                        columnNumber: 15
                                    }, this),
                                    index < orderedSteps.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1 h-12 mt-2 ".concat(getConnectorStyle(step.status))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 472,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                lineNumber: 469,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 pb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-semibold text-lg",
                                                children: step.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                                lineNumber: 478,
                                                columnNumber: 17
                                            }, this),
                                            step.date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded",
                                                title: new Date(step.date).toISOString(),
                                                children: fmt(step.date)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                                lineNumber: 480,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 477,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 mb-2",
                                        children: step.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 486,
                                        columnNumber: 15
                                    }, this),
                                    step.id === "formulaire" && step.status !== "completed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCompleteForm,
                                        className: "px-3 py-1.5 rounded text-xs font-medium border bg-blue-600 text-white hover:bg-blue-700",
                                        children: "✅ Marquer le formulaire comme fait"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 489,
                                        columnNumber: 17
                                    }, this),
                                    step.id === "pieces" && !loadingPieces && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-2",
                                                children: ((piecesData === null || piecesData === void 0 ? void 0 : piecesData.pieces_state) || []).filter((p)=>p.piece_key !== "MandatSigne").map((p)=>{
                                                    var _piecesData_capabilities;
                                                    const isUploaded = p.status === "valide" || p.status === "en_attente";
                                                    const canUpload = (piecesData === null || piecesData === void 0 ? void 0 : (_piecesData_capabilities = piecesData.capabilities) === null || _piecesData_capabilities === void 0 ? void 0 : _piecesData_capabilities.canUpload) !== false;
                                                    const disabled = uploadingStep === p.piece_key || p.status === "valide" || !canUpload;
                                                    const exp = getPieceExpected(p.piece_key);
                                                    const ext = Array.isArray(exp === null || exp === void 0 ? void 0 : exp.accept_ext) ? exp.accept_ext.join(", ") : "pdf, jpg, png";
                                                    const title = (p.status === "valide" ? "Validée" : p.status === "en_attente" ? "En revue" : p.status === "refusee" ? "Refusée".concat(p.reason ? " — " + p.reason : "") : "À fournir") + " • Formats: ".concat(ext);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleUploadPiece(p.piece_key),
                                                        disabled: disabled,
                                                        title: title,
                                                        className: "px-3 py-1.5 rounded text-xs font-medium border transition disabled:opacity-50 ".concat(isUploaded ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100" : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"),
                                                        children: uploadingStep === p.piece_key ? "📤 Envoi…" : p.piece_label || p.piece_key
                                                    }, p.piece_key, false, {
                                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                                        lineNumber: 519,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                                lineNumber: 499,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-1 text-[11px] text-gray-500",
                                                children: "🟢 Uploadé / en revue • 🔴 À uploader"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                                lineNumber: 535,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true),
                                    step.id === "mandat" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: (()=>{
                                            var _piecesData_capabilities;
                                            const m = getPieceState("MandatSigne");
                                            const status = (m === null || m === void 0 ? void 0 : m.status) || "missing";
                                            const isUploaded = status === "valide" || status === "en_attente";
                                            const canUpload = (piecesData === null || piecesData === void 0 ? void 0 : (_piecesData_capabilities = piecesData.capabilities) === null || _piecesData_capabilities === void 0 ? void 0 : _piecesData_capabilities.canUpload) !== false;
                                            const disabled = uploadingStep === "MandatSigne" || status === "valide" || !canUpload;
                                            const exp = getPieceExpected("MandatSigne");
                                            const ext = Array.isArray(exp === null || exp === void 0 ? void 0 : exp.accept_ext) ? exp.accept_ext.join(", ") : "pdf, jpg, png";
                                            const title = (status === "valide" ? "Mandat validé" : status === "en_attente" ? "En revue" : status === "refusee" ? "Refusé".concat((m === null || m === void 0 ? void 0 : m.reason) ? " — " + m.reason : "") : "À fournir") + " • Formats: ".concat(ext);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleUploadPiece("MandatSigne"),
                                                disabled: disabled,
                                                title: title,
                                                className: "px-3 py-1.5 rounded text-xs font-medium border transition disabled:opacity-50 ".concat(isUploaded ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100" : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"),
                                                children: uploadingStep === "MandatSigne" ? "📤 Envoi…" : isUploaded ? "Mandat ✅" : "Uploader le mandat"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                                lineNumber: 560,
                                                columnNumber: 23
                                            }, this);
                                        })()
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 540,
                                        columnNumber: 17
                                    }, this),
                                    step.id === "siren" && step.status === "completed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleDownload("sirene"),
                                            className: "px-3 py-1.5 rounded text-xs font-semibold bg-green-600 text-white hover:bg-green-700",
                                            children: "📥 Télécharger l'avis SIRENE"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                            lineNumber: 579,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 578,
                                        columnNumber: 17
                                    }, this),
                                    step.id === "attestation" && step.status === "completed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleDownload("attestation"),
                                            className: "px-3 py-1.5 rounded text-xs font-semibold bg-green-600 text-white hover:bg-green-700",
                                            children: "📥 Télécharger l'attestation"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                            lineNumber: 590,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                        lineNumber: 589,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                lineNumber: 476,
                                columnNumber: 13
                            }, this)
                        ]
                    }, step.id, true, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                        lineNumber: 468,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                lineNumber: 466,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 pt-3 border-t bg-gray-50 -m-4 p-4 rounded-b",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid md:grid-cols-4 gap-4 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Créé le:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 607,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 608,
                                    columnNumber: 13
                                }, this),
                                fmt(dossier.date_creation)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 606,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Dernière MAJ:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 612,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 613,
                                    columnNumber: 13
                                }, this),
                                fmt(dossier.derniere_modification)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 611,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Documents générés:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 617,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 618,
                                    columnNumber: 13
                                }, this),
                                (timelineData === null || timelineData === void 0 ? void 0 : (_timelineData_metrics1 = timelineData.metrics) === null || _timelineData_metrics1 === void 0 ? void 0 : _timelineData_metrics1.documents_officiels_count) || 0
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 616,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Référence:"
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 622,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                                    lineNumber: 623,
                                    columnNumber: 13
                                }, this),
                                "#",
                                dossier.id
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                            lineNumber: 621,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                    lineNumber: 605,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
                lineNumber: 604,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js",
        lineNumber: 387,
        columnNumber: 5
    }, this);
}
_s(DossierTimeline, "IpRZwY4Nl7LmhOXkNWCQx/iOvIM=");
_c = DossierTimeline;
var _c;
__turbopack_context__.k.register(_c, "DossierTimeline");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>ClientIdentityCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const fmt = (d)=>d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const show = (v)=>(v !== null && v !== void 0 ? v : v === 0) ? String(v) : "—";
function ClientIdentityCard(param) {
    let { client } = param;
    if (!client) return null;
    var _client_adresse_personnelle;
    const adr = (_client_adresse_personnelle = client.adresse_personnelle) !== null && _client_adresse_personnelle !== void 0 ? _client_adresse_personnelle : {};
    var _client_adresse_fiscale;
    const adrfis = (_client_adresse_fiscale = client.adresse_fiscale) !== null && _client_adresse_fiscale !== void 0 ? _client_adresse_fiscale : {};
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold mb-3",
                children: "🆔 Identité & adresses"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border rounded p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "list-disc pl-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                "Naissance: ",
                                fmt(client.date_naissance),
                                " — ",
                                show(client.commune_naissance),
                                ", ",
                                show(client.pays_naissance),
                                " — ",
                                show(client.nationalite)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                "Adresse perso: ",
                                show(adr.ligne1),
                                ", ",
                                show(adr.code_postal),
                                " ",
                                show(adr.ville)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                "Adresse fiscale",
                                adrfis.est_differente ? "" : " (identique)",
                                ": ",
                                show(adrfis.ligne1),
                                ", ",
                                show(adrfis.code_postal),
                                " ",
                                show(adrfis.ville)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                "NIR: ",
                                show(client.numero_securite_sociale)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js",
                lineNumber: 14,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = ClientIdentityCard;
var _c;
__turbopack_context__.k.register(_c, "ClientIdentityCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>PiecesJustificativesCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const fmt = (d)=>d ? new Date(d).toISOString().slice(0, 10) : "—";
const show = (v)=>(v !== null && v !== void 0 ? v : v === 0) ? String(v) : "—";
function PiecesJustificativesCard(param) {
    let { pieces = [], downloads = [], requiredTypes = [] } = param;
    // Comptes dérivés de la BDD (pas de valeurs par défaut)
    const total = pieces.length;
    const valides = pieces.filter((p)=>p.statut === "valide").length;
    const missing = requiredTypes.length ? requiredTypes.filter((t)=>!pieces.some((p)=>p.type === t)) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold mb-3",
                children: "📄 Pièces justificatives"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border rounded p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Statut:"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                                lineNumber: 26,
                                columnNumber: 11
                            }, this),
                            " ",
                            valides,
                            "/",
                            total,
                            " validées",
                            requiredTypes.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-2",
                                children: [
                                    "— Requises manquantes: ",
                                    missing.length ? missing.join(", ") : "—"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                                lineNumber: 28,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6",
                        children: total ? pieces.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    show(p.type),
                                    " — ",
                                    show(p.fichier),
                                    " — ",
                                    show(p.statut),
                                    p.motif_refus ? " (".concat(p.motif_refus, ")") : "",
                                    " ",
                                    p.uploaded_at ? "(".concat(fmt(p.uploaded_at), ")") : ""
                                ]
                            }, i, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                                lineNumber: 36,
                                columnNumber: 13
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "—"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                            lineNumber: 40,
                            columnNumber: 16
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-medium mt-3",
                        children: "Téléchargements disponibles"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6",
                        children: downloads.length ? downloads.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    show(d.type),
                                    " — ",
                                    show(d.fichier)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "—"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                            lineNumber: 47,
                            columnNumber: 16
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = PiecesJustificativesCard;
var _c;
__turbopack_context__.k.register(_c, "PiecesJustificativesCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(crm)/crm/clients/[id]/CommsHistory.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>NotificationsRelancesCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function NotificationsRelancesCard(param) {
    let { relances = [], notifications = [] } = param;
    // Fusionner relances + notifications
    let items = [
        ...relances,
        ...notifications
    ];
    // Trier par date décroissante
    items = items.sort((a, b)=>(new Date(b.scheduled_for).getTime() || 0) - (new Date(a.scheduled_for).getTime() || 0));
    if (!items.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "bg-white border rounded p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-3",
                    children: "📨 Historique (relances & notifications)"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 text-sm",
                    children: "Aucune relance ou notification programmée."
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
            lineNumber: 16,
            columnNumber: 7
        }, this);
    }
    // Badge couleur selon le type
    const badge = (type)=>{
        if (type.startsWith("relance")) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800",
                children: "Relance"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                lineNumber: 29,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800",
            children: "Notification"
        }, void 0, false, {
            fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    };
    // Format date
    const fmt = (d)=>d ? new Date(d).toLocaleString("fr-FR") : "—";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "bg-white border rounded p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold mb-3",
                children: "📨 Historique (relances & notifications)"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-3",
                children: items.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "border rounded p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            badge(x.type),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-600",
                                                children: x.canal || "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                                                lineNumber: 53,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                                        lineNumber: 51,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500",
                                        children: fmt(x.scheduled_for)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            x.message && x.message.trim() !== "" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-sm text-gray-700 whitespace-pre-wrap",
                                children: x.message
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                                lineNumber: 63,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-sm text-gray-400 italic",
                                children: "Aucun message"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                                lineNumber: 67,
                                columnNumber: 15
                            }, this)
                        ]
                    }, x.id, true, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/clients/[id]/CommsHistory.js",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_c = NotificationsRelancesCard;
var _c;
__turbopack_context__.k.register(_c, "NotificationsRelancesCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>ClientMessaging
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const fmt = (d)=>d ? new Date(d).toLocaleString("fr-FR") : "-";
function ClientMessaging(param) {
    let { clientId, dossiers, senderType = "Opérateur" } = param;
    _s();
    const [selectedDossier, setSelectedDossier] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newMessage, setNewMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Détermine qui envoie le message
    const isClientSending = senderType === "Client";
    const isOperatorSending = senderType === "Opérateur";
    // Sélectionner le premier dossier par défaut
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClientMessaging.useEffect": ()=>{
            if (dossiers.length > 0 && !selectedDossier) {
                setSelectedDossier(dossiers[0]);
            }
        }
    }["ClientMessaging.useEffect"], [
        dossiers,
        selectedDossier
    ]);
    // Charger messages du dossier sélectionné
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClientMessaging.useEffect": ()=>{
            if (!selectedDossier) return;
            setLoading(true);
            fetch("/api/dossiers/".concat(selectedDossier.id, "/messages"), {
                cache: "no-store"
            }).then({
                "ClientMessaging.useEffect": (r)=>r.ok ? r.json() : Promise.reject(r)
            }["ClientMessaging.useEffect"]).then({
                "ClientMessaging.useEffect": (data)=>setMessages(data.messages || [])
            }["ClientMessaging.useEffect"]).catch({
                "ClientMessaging.useEffect": (e)=>{
                    console.error("Erreur chargement messages:", e);
                    setMessages([]);
                }
            }["ClientMessaging.useEffect"]).finally({
                "ClientMessaging.useEffect": ()=>setLoading(false)
            }["ClientMessaging.useEffect"]);
        }
    }["ClientMessaging.useEffect"], [
        selectedDossier
    ]);
    // Envoyer nouveau message (adapté selon le sender)
    async function sendMessage() {
        if (!newMessage.trim() || !selectedDossier) return;
        setSending(true);
        try {
            const r = await fetch("/api/dossiers/".concat(selectedDossier.id, "/messages"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender_type: senderType,
                    body: newMessage.trim(),
                    send_email: isOperatorSending // Email seulement si opérateur envoie
                })
            });
            if (!r.ok) throw new Error("HTTP ".concat(r.status));
            const data = await r.json();
            // Recharger les messages
            setMessages((prev)=>[
                    ...prev,
                    data.message
                ]);
            setNewMessage("");
            // Alerte différente selon qui envoie
            if (isOperatorSending && data.email_sent) {
                alert("Message envoyé et email automatique expédié à ".concat(data.client_email));
            } else if (isClientSending) {
                alert("Message envoyé à l'équipe !");
            }
        } catch (e) {
            console.error("Erreur envoi message:", e);
            alert("Erreur lors de l'envoi du message");
        } finally{
            setSending(false);
        }
    }
    const getSenderColor = (senderType)=>{
        switch(senderType){
            case "Client":
                return "bg-blue-50 border-l-4 border-l-blue-500";
            case "Opérateur":
                return "bg-green-50 border-l-4 border-l-green-500";
            case "Système":
                return "bg-gray-50 border-l-4 border-l-gray-500";
            default:
                return "bg-gray-50";
        }
    };
    const getSenderIcon = (senderType)=>{
        switch(senderType){
            case "Client":
                return "👤";
            case "Opérateur":
                return "👨‍💼";
            case "Système":
                return "🤖";
            default:
                return "💬";
        }
    };
    // Affichage du nom de l'expéditeur selon le contexte
    const getSenderDisplayName = (msgSenderType)=>{
        if (isClientSending) {
            // Vue client : "Vous" pour ses messages, "Équipe" pour les opérateurs
            return msgSenderType === "Client" ? "Vous" : msgSenderType === "Opérateur" ? "Équipe" : msgSenderType;
        } else {
            // Vue opérateur : noms normaux
            return msgSenderType;
        }
    };
    if (dossiers.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "border rounded p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-3",
                    children: "💬 Messagerie"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                    lineNumber: 111,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600",
                    children: [
                        "Aucun dossier trouvé",
                        isClientSending ? "" : " pour ce client",
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                    lineNumber: 112,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
            lineNumber: 110,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "border rounded p-4 space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold",
                children: [
                    "💬 ",
                    isClientSending ? "Messagerie avec votre équipe" : "Messagerie Client",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-normal text-gray-600 ml-2",
                        children: isClientSending ? "(Communication avec nos opérateurs)" : "(Communication directe avec le client)"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            dossiers.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-1",
                        children: "Dossier à afficher :"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "border rounded p-2",
                        value: (selectedDossier === null || selectedDossier === void 0 ? void 0 : selectedDossier.id) || "",
                        onChange: (e)=>{
                            const dossier = dossiers.find((d)=>d.id === parseInt(e.target.value));
                            setSelectedDossier(dossier);
                        },
                        children: dossiers.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: d.id,
                                children: [
                                    "Dossier #",
                                    d.id,
                                    " - ",
                                    d.statut
                                ]
                            }, d.id, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                lineNumber: 144,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                lineNumber: 131,
                columnNumber: 9
            }, this),
            selectedDossier && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm bg-blue-50 p-2 rounded",
                        children: [
                            "📁 ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: [
                                    "Dossier #",
                                    selectedDossier.id
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                lineNumber: 155,
                                columnNumber: 16
                            }, this),
                            " - Statut: ",
                            selectedDossier.statut
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3 max-h-96 overflow-y-auto",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600",
                            children: "Chargement des messages..."
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                            lineNumber: 161,
                            columnNumber: 15
                        }, this) : messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600",
                            children: "Aucun message pour ce dossier."
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                            lineNumber: 163,
                            columnNumber: 15
                        }, this) : messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 rounded ".concat(getSenderColor(msg.sender_type)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: getSenderIcon(msg.sender_type)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                                        lineNumber: 172,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        className: "text-sm",
                                                        children: getSenderDisplayName(msg.sender_type)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                                        lineNumber: 173,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                                lineNumber: 171,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-600",
                                                children: fmt(msg.at)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                                lineNumber: 177,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                        lineNumber: 170,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "whitespace-pre-wrap",
                                        children: msg.body
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                        lineNumber: 181,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, msg.id, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                lineNumber: 166,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                        lineNumber: 159,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t pt-4 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-medium",
                                children: isClientSending ? "✉️ Envoyer un message à l'équipe" : "✉️ Répondre au client"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                lineNumber: 189,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "w-full border rounded p-3 h-24",
                                placeholder: isClientSending ? "Votre message à l'équipe..." : "Votre message sera envoyé au client par email...",
                                value: newMessage,
                                onChange: (e)=>setNewMessage(e.target.value),
                                disabled: sending
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50",
                                        onClick: sendMessage,
                                        disabled: sending || !newMessage.trim(),
                                        children: sending ? "Envoi..." : isClientSending ? "📤 Envoyer à l'équipe" : "📧 Envoyer au client"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "border px-4 py-2 rounded",
                                        onClick: ()=>setNewMessage(""),
                                        disabled: sending,
                                        children: "Effacer"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600",
                                children: [
                                    "💡 ",
                                    isClientSending ? "Votre message sera envoyé à l'équipe et ajouté à l'historique de votre dossier." : "Le message sera ajouté à l'historique et envoyé automatiquement par email au client."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(ClientMessaging, "pEsuvkVBT26jdx8wT4jrPjfPM6E=");
_c = ClientMessaging;
var _c;
__turbopack_context__.k.register(_c, "ClientMessaging");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>PartnerTracking
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const fmt = (d)=>d ? new Date(d).toLocaleDateString("fr-FR") : "-";
const fmtDateTime = (d)=>d ? new Date(d).toLocaleString("fr-FR") : "-";
function PartnerTracking(param) {
    let { partnerId } = param;
    var _data_references, _data_references1;
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [adding, setAdding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Formulaire nouvelle interaction
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type_interaction: 'appel',
        direction: 'sortant',
        sujet: '',
        notes: '',
        participant: '',
        duree_minutes: '',
        prochaine_action: '',
        rappel_date: ''
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PartnerTracking.useEffect": ()=>{
            if (partnerId) {
                loadData();
            }
        }
    }["PartnerTracking.useEffect"], [
        partnerId
    ]);
    async function loadData() {
        setLoading(true);
        try {
            const r = await fetch("/api/partenaires/".concat(partnerId, "/interactions"), {
                cache: "no-store"
            });
            if (r.ok) {
                const json = await r.json();
                setData(json);
            }
        } catch (e) {
            console.error("Erreur chargement interactions:", e);
        } finally{
            setLoading(false);
        }
    }
    async function addInteraction() {
        if (!form.sujet.trim()) {
            alert("Sujet requis");
            return;
        }
        setAdding(true);
        try {
            const r = await fetch("/api/partenaires/".concat(partnerId, "/interactions"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
            if (r.ok) {
                await loadData();
                setForm({
                    type_interaction: 'appel',
                    direction: 'sortant',
                    sujet: '',
                    notes: '',
                    participant: '',
                    duree_minutes: '',
                    prochaine_action: '',
                    rappel_date: ''
                });
                setShowForm(false);
            } else {
                throw new Error("Erreur création");
            }
        } catch (e) {
            console.error("Erreur ajout interaction:", e);
            alert("Erreur lors de l'ajout");
        } finally{
            setAdding(false);
        }
    }
    const getTypeIcon = (type)=>{
        switch(type){
            case 'appel':
                return '📞';
            case 'email':
                return '✉️';
            case 'reunion':
                return '🤝';
            case 'relance':
                return '📋';
            case 'note':
                return '📝';
            default:
                return '📄';
        }
    };
    const getTypeColor = (type)=>{
        switch(type){
            case 'appel':
                return 'bg-blue-50 border-l-blue-500';
            case 'email':
                return 'bg-green-50 border-l-green-500';
            case 'reunion':
                return 'bg-purple-50 border-l-purple-500';
            case 'relance':
                return 'bg-orange-50 border-l-orange-500';
            case 'note':
                return 'bg-gray-50 border-l-gray-500';
            default:
                return 'bg-gray-50 border-l-gray-500';
        }
    };
    if (!partnerId) {
        return null;
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "border rounded p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-3",
                    children: "🤝 Suivi Commercial"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-600",
                    children: "Chargement..."
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
            lineNumber: 112,
            columnNumber: 7
        }, this);
    }
    const interactions = (data === null || data === void 0 ? void 0 : data.interactions) || [];
    const prochaines = (data === null || data === void 0 ? void 0 : data.prochaines_actions) || [];
    const stats = (data === null || data === void 0 ? void 0 : data.stats) || {};
    const types = (data === null || data === void 0 ? void 0 : (_data_references = data.references) === null || _data_references === void 0 ? void 0 : _data_references.types) || [];
    const directions = (data === null || data === void 0 ? void 0 : (_data_references1 = data.references) === null || _data_references1 === void 0 ? void 0 : _data_references1.directions) || [];
    const suggestedContacts = (data === null || data === void 0 ? void 0 : data.suggested_contacts) || [];
    // Fonction pour sélectionner un contact suggéré
    const selectContact = (contact)=>{
        setForm((prev)=>({
                ...prev,
                participant: contact.nom
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "border rounded p-4 space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold",
                        children: "🤝 Suivi Commercial"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-blue-600 text-white px-3 py-2 rounded text-sm",
                        onClick: ()=>setShowForm(!showForm),
                        children: showForm ? "Annuler" : "+ Nouvelle interaction"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-blue-50 p-3 rounded text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold text-blue-600",
                                children: stats.total_interactions || 0
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-600",
                                children: "Total interactions"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-green-50 p-3 rounded text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold text-green-600",
                                children: stats.interactions_30j || 0
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-600",
                                children: "Ce mois"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-purple-50 p-3 rounded text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold text-purple-600",
                                children: stats.nb_reunions || 0
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-600",
                                children: "Réunions"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-orange-50 p-3 rounded text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xl font-bold text-orange-600",
                                children: stats.actions_en_attente || 0
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-600",
                                children: "Actions en attente"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            prochaines.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-yellow-50 border border-yellow-200 rounded p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-medium text-yellow-800 mb-2",
                        children: "⏰ Prochaines actions"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: prochaines.map((action)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: action.prochaine_action
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, this),
                                    action.rappel_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-yellow-700 ml-2",
                                        children: [
                                            "(Rappel: ",
                                            fmt(action.rappel_date),
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 175,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, action.id, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 172,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                lineNumber: 168,
                columnNumber: 9
            }, this),
            showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border rounded p-4 bg-gray-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-medium mb-3",
                        children: "Nouvelle interaction"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Type *"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "border rounded p-2",
                                        value: form.type_interaction,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    type_interaction: e.target.value
                                                })),
                                        children: types.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: type.value,
                                                children: type.label
                                            }, type.value, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 199,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 193,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Direction"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "border rounded p-2",
                                        value: form.direction,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    direction: e.target.value
                                                })),
                                        children: directions.map((dir)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: dir.value,
                                                children: dir.label
                                            }, dir.value, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 212,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm md:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Sujet *"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        className: "border rounded p-2",
                                        value: form.sujet,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    sujet: e.target.value
                                                })),
                                        placeholder: "Ex: Suivi mensuel performance"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 219,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Participant"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this),
                                    suggestedContacts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-600 mb-1",
                                                children: "Contacts suggérés :"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 234,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-1",
                                                children: suggestedContacts.map((contact, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200",
                                                        onClick: ()=>selectContact(contact),
                                                        children: [
                                                            contact.nom,
                                                            contact.type === 'Référent principal' && ' 👑'
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                        lineNumber: 237,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 235,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 233,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        className: "border rounded p-2",
                                        value: form.participant,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    participant: e.target.value
                                                })),
                                        placeholder: "Nom du contact ou sélectionnez ci-dessus",
                                        list: "contacts-datalist"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                        id: "contacts-datalist",
                                        children: suggestedContacts.map((contact, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: contact.nom,
                                                children: contact.display
                                            }, i, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 264,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Durée (minutes)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        className: "border rounded p-2",
                                        value: form.duree_minutes,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    duree_minutes: e.target.value
                                                })),
                                        placeholder: "30"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm md:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Notes"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "border rounded p-2 h-20",
                                        value: form.notes,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    notes: e.target.value
                                                })),
                                        placeholder: "Détails de l'interaction..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Prochaine action"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        className: "border rounded p-2",
                                        value: form.prochaine_action,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    prochaine_action: e.target.value
                                                })),
                                        placeholder: "Ex: Programmer réunion bilan"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 292,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Rappel le"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 304,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        className: "border rounded p-2",
                                        value: form.rappel_date,
                                        onChange: (e)=>setForm((prev)=>({
                                                    ...prev,
                                                    rappel_date: e.target.value
                                                }))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 305,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 303,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50",
                                onClick: addInteraction,
                                disabled: adding || !form.sujet.trim(),
                                children: adding ? "Ajout..." : "✅ Ajouter"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "border px-4 py-2 rounded",
                                onClick: ()=>setShowForm(false),
                                children: "Annuler"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 322,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 314,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                lineNumber: 187,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-medium mb-3",
                        children: "Historique des interactions"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this),
                    interactions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-center py-4",
                        children: "Aucune interaction enregistrée. Ajoutez la première !"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 337,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3 max-h-96 overflow-y-auto",
                        children: interactions.map((interaction)=>{
                            var _suggestedContacts_find;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-l-4 p-3 rounded ".concat(getTypeColor(interaction.type_interaction)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: getTypeIcon(interaction.type_interaction)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                        lineNumber: 349,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                className: "font-medium",
                                                                children: interaction.sujet
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                                lineNumber: 351,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-gray-600",
                                                                children: [
                                                                    interaction.type_interaction,
                                                                    " ",
                                                                    interaction.direction,
                                                                    interaction.participant && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            " avec ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-medium",
                                                                                children: interaction.participant
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                                                lineNumber: 357,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            suggestedContacts.find((c)=>c.nom === interaction.participant) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs bg-green-100 text-green-700 px-1 rounded ml-1",
                                                                                children: ((_suggestedContacts_find = suggestedContacts.find((c)=>c.nom === interaction.participant)) === null || _suggestedContacts_find === void 0 ? void 0 : _suggestedContacts_find.type) === 'Référent principal' ? '👑' : '✓'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                                                lineNumber: 360,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true),
                                                                    interaction.duree_minutes && " (".concat(interaction.duree_minutes, "min)")
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                                lineNumber: 352,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                        lineNumber: 350,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 348,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-500",
                                                children: fmtDateTime(interaction.date_interaction)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 370,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 347,
                                        columnNumber: 17
                                    }, this),
                                    interaction.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm mt-2 bg-white p-2 rounded",
                                        children: interaction.notes
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 376,
                                        columnNumber: 19
                                    }, this),
                                    interaction.prochaine_action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm mt-2 text-orange-700 bg-orange-100 p-2 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "→ Prochaine action:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 383,
                                                columnNumber: 21
                                            }, this),
                                            " ",
                                            interaction.prochaine_action,
                                            interaction.rappel_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-2",
                                                children: [
                                                    "(Rappel: ",
                                                    fmt(interaction.rappel_date),
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                                lineNumber: 385,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 382,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400 mt-2",
                                        children: [
                                            "Par ",
                                            interaction.created_by
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                        lineNumber: 390,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, interaction.id, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                                lineNumber: 343,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                        lineNumber: 341,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                lineNumber: 333,
                columnNumber: 7
            }, this),
            stats.derniere_interaction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-gray-500 text-center pt-2 border-t",
                children: [
                    "Dernière interaction: ",
                    fmtDateTime(stats.derniere_interaction)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
                lineNumber: 400,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_s(PartnerTracking, "lS3NgXaj2wM6FKPiOpsQTHpCYCQ=");
_c = PartnerTracking;
var _c;
__turbopack_context__.k.register(_c, "PartnerTracking");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>InvoicesCommissionsCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const fmt = (d)=>d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const num = (n)=>n === 0 ? "0" : n != null ? Number(n).toLocaleString("fr-FR") : "—";
function InvoicesCommissionsCard(param) {
    let { partnerId, data } = param;
    var _m_partner_paiement, _m_partner_paiement1;
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        loading: false,
        error: null,
        model: null
    });
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        periode: new Date().toISOString().slice(0, 7),
        echeance_jours: 30
    });
    const [generating, setGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [preview, setPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoicesCommissionsCard.useEffect": ()=>{
            if (data) build(data);
            else if (partnerId) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["InvoicesCommissionsCard.useEffect"], [
        partnerId,
        data
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoicesCommissionsCard.useEffect": ()=>{
            if (!partnerId) return;
            const today = new Date();
            if (today.getUTCDate() !== 1) return;
            const prev = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
            const period = "".concat(prev.getUTCFullYear(), "-").concat(String(prev.getUTCMonth() + 1).padStart(2, "0"));
            const key = "autoClose:".concat(partnerId, ":").concat(period);
            if (localStorage.getItem(key)) return; // déjà fait
            fetch("/api/partenaires/close-month", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    period,
                    partnerId
                })
            }).then({
                "InvoicesCommissionsCard.useEffect": ()=>{
                    localStorage.setItem(key, "1");
                    return load();
                }
            }["InvoicesCommissionsCard.useEffect"]).catch({
                "InvoicesCommissionsCard.useEffect": ()=>{}
            }["InvoicesCommissionsCard.useEffect"]);
        }
    }["InvoicesCommissionsCard.useEffect"], [
        partnerId
    ]);
    async function load() {
        try {
            setState((s)=>({
                    ...s,
                    loading: true,
                    error: null
                }));
            const r = await fetch("/api/partenaires/".concat(partnerId), {
                cache: "no-store"
            });
            if (!r.ok) throw new Error("HTTP ".concat(r.status));
            build(await r.json());
        } catch (e) {
            console.error(e);
            setState({
                loading: false,
                error: "Impossible de charger les factures",
                model: null
            });
        }
    }
    function build(raw) {
        var _ca_find;
        const p = raw.partenaire || {};
        const ca = Array.isArray(raw.ca_par_periode) ? raw.ca_par_periode : [];
        const factures = Array.isArray(raw.factures) ? [
            ...raw.factures
        ] : [];
        const taux = Number(p.taux_commission) || 0;
        const nowMonth = new Date().toISOString().slice(0, 7);
        const caMois = Number((_ca_find = ca.find((x)=>x.periode === nowMonth)) === null || _ca_find === void 0 ? void 0 : _ca_find.ca) || 0;
        const commissionsMois = Number((caMois * taux / 100).toFixed(2));
        const thisYear = new Date().getFullYear().toString();
        const caAnnuel = ca.filter((x)=>String(x.periode || "").startsWith(thisYear)).reduce((s, x)=>s + (Number(x.ca) || 0), 0);
        const commissionsAnnuelles = Number((caAnnuel * taux / 100).toFixed(2));
        const payees = factures.filter((f)=>f.statut === "payee");
        const impayees = factures.filter((f)=>f.statut !== "payee"); // tout sauf payée
        const montantImpaye = impayees.reduce((s, f)=>s + (Number(f.montant) || 0), 0);
        const montantPaye = payees.reduce((s, f)=>s + (Number(f.montant) || 0), 0);
        const today = new Date().toISOString().slice(0, 10);
        const enRetard = impayees.filter((f)=>f.echeance && f.echeance < today);
        const d30 = new Date();
        d30.setDate(d30.getDate() + 30);
        const prochaines = impayees.filter((f)=>f.echeance && f.echeance <= d30.toISOString().slice(0, 10));
        factures.sort((a, b)=>new Date(b.date || 0) - new Date(a.date || 0));
        setState({
            loading: false,
            error: null,
            model: {
                commissions: {
                    ceMois: commissionsMois,
                    caCeMois: caMois,
                    tauxCommission: taux,
                    periode: nowMonth,
                    commissionsAnnuelles
                },
                factures: {
                    toutes: factures,
                    impayees,
                    payees,
                    enRetard
                },
                totaux: {
                    montantImpaye,
                    montantPaye,
                    nombreImpayees: impayees.length,
                    nombrePayees: payees.length
                },
                alertes: {
                    retard: enRetard.length,
                    prochainesEcheances: prochaines.length
                },
                coord: p.coordonnees_facturation || {},
                partner: p
            }
        });
    }
    async function previewInvoice() {
        try {
            setGenerating(true);
            setPreview(null);
            const r = await fetch("/api/partenaires/".concat(partnerId, "/invoices"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "preview",
                    period: form.periode
                })
            });
            const j = await r.json().catch(()=>({}));
            if (!r.ok) throw new Error(j.detail || j.error || "HTTP ".concat(r.status));
            const p = j.preview || {};
            var _p_dossiers_count, _ref, _p_commission_eur, _ref1;
            // normalisation champs
            const normalized = {
                periode: p.periode || p.period || form.periode,
                dossiers_count: (_ref = (_p_dossiers_count = p.dossiers_count) !== null && _p_dossiers_count !== void 0 ? _p_dossiers_count : p.dossiers) !== null && _ref !== void 0 ? _ref : 0,
                commission_eur: (_ref1 = (_p_commission_eur = p.commission_eur) !== null && _p_commission_eur !== void 0 ? _p_commission_eur : p.montant) !== null && _ref1 !== void 0 ? _ref1 : 0
            };
            setPreview(normalized);
        } catch (e) {
            alert("❌ Aperçu impossible: ".concat(e.message));
        } finally{
            setGenerating(false);
        }
    }
    async function generateInvoice() {
        try {
            setGenerating(true);
            const r = await fetch("/api/partenaires/".concat(partnerId, "/invoices"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // même contrat que la page qui fonctionne
                body: JSON.stringify({
                    action: "create",
                    period: form.periode,
                    echeance_jours: form.echeance_jours || 30
                })
            });
            const j = await r.json().catch(()=>({}));
            if (!r.ok) throw new Error(j.detail || j.error || "HTTP ".concat(r.status));
            alert("✅ Facture générée avec succès");
            setShowForm(false);
            setForm({
                periode: new Date().toISOString().slice(0, 7),
                echeance_jours: 30
            });
            setPreview(j.preview || null);
            // recharger les données
            await load();
        } catch (e) {
            console.error(e);
            alert("❌ Erreur: ".concat(e.message));
        } finally{
            setGenerating(false);
        }
    }
    async function download(f) {
        try {
            if (f.pdf && f.pdf.startsWith("http")) return window.open(f.pdf, "_blank");
            const r = await fetch("/api/partenaires/".concat(partnerId, "/invoices/").concat(f.id, "/pdf"));
            if (!r.ok) throw new Error("Document non disponible");
            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            const a = Object.assign(document.createElement("a"), {
                href: url,
                download: "facture_".concat(f.id, ".pdf")
            });
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            a.remove();
        } catch (e) {
            console.error(e);
            alert("❌ Impossible de télécharger la facture");
        }
    }
    // reset l'aperçu quand on change la période
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoicesCommissionsCard.useEffect": ()=>{
            setPreview(null);
        }
    }["InvoicesCommissionsCard.useEffect"], [
        form.periode
    ]);
    if (state.loading && !state.model) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "bg-white border rounded-lg p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold",
                children: "💰 Facturation & Commissions"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 183,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
            lineNumber: 182,
            columnNumber: 7
        }, this);
    }
    if (state.error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "bg-white border rounded-lg p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-4",
                    children: "💰 Facturation & Commissions"
                }, void 0, false, {
                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                    lineNumber: 190,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-50 border border-red-200 rounded p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-800",
                            children: [
                                "❌ ",
                                state.error
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: load,
                            className: "mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700",
                            children: "🔄 Réessayer"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                            lineNumber: 193,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                    lineNumber: 191,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
            lineNumber: 189,
            columnNumber: 7
        }, this);
    }
    if (!state.model) return null;
    const m = state.model;
    function currentYYYYMM() {
        return new Date().toISOString().slice(0, 7);
    }
    function displayStateLabel(f) {
        if ((f === null || f === void 0 ? void 0 : f.statut) === 'payee') return "Clôturée";
        const nowYM = new Date().toISOString().slice(0, 7);
        return String(f.periode) < nowYM ? "Clôturée" : "Temporaire";
    }
    function stateBadge(f) {
        const label = displayStateLabel(f);
        const map = {
            "Clôturée": [
                "bg-green-100 text-green-800",
                "✅ Clôturée"
            ],
            "Temporaire": [
                "bg-orange-100 text-orange-800",
                "⏳ Temporaire"
            ]
        };
        const [cls, text] = map[label] || [
            "bg-gray-100 text-gray-800",
            "📋 ".concat(label)
        ];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ".concat(cls),
            children: text
        }, void 0, false, {
            fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
            lineNumber: 219,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "bg-white border rounded-lg p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold",
                        children: "💰 Facturation & Commissions"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: load,
                                className: "text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md",
                                children: "🔄 Actualiser"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowForm((s)=>!s),
                                className: "text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700",
                                children: showForm ? "Annuler" : "+ Générer facture"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: async ()=>{
                    try {
                        const res = await fetch("/api/partenaires/close-month", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                period: new Date().toISOString().slice(0, 7),
                                partnerId
                            })
                        });
                        if (!res.ok) {
                            const j = await res.json().catch(()=>({}));
                            throw new Error(j.details || j.error || "HTTP ".concat(res.status));
                        }
                        await load();
                        alert("✅ Facture clôturée avec succès !");
                    } catch (e) {
                        alert("❌ Impossible de clôturer la facture : ".concat(e.message));
                    }
                },
                className: "text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md mb-6",
                children: "🔒 Clôturer ce mois"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 236,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-medium text-gray-700 mb-3",
                        children: "💸 Commissions à recevoir"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Box, {
                                title: "Ce mois (temporaire)",
                                value: "".concat(num(m.commissions.ceMois), "€"),
                                subtitle: "CA: ".concat(num(m.commissions.caCeMois), "€")
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 265,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Box, {
                                title: "Taux commission",
                                value: "".concat(num(m.commissions.tauxCommission), "%")
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Box, {
                                title: "Période",
                                value: m.commissions.periode,
                                subtitle: "YYYY-MM"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs text-gray-500",
                        children: "Montant temporaire — la facture du mois précédent est générée et marquée « payée » automatiquement le 1er du mois."
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 269,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 262,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-medium text-gray-700 mb-3",
                        children: "🧾 État facturation"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Box, {
                                title: "En attente",
                                value: "".concat(num(m.totaux.montantImpaye), "€"),
                                subtitle: "".concat(m.totaux.nombreImpayees, " facture(s)")
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Box, {
                                title: "Payé",
                                value: "".concat(num(m.totaux.montantPaye), "€"),
                                subtitle: "".concat(m.totaux.nombrePayees, " facture(s)")
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Box, {
                                title: "Total factures",
                                value: m.factures.toutes.length,
                                subtitle: "Historique"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 276,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 274,
                columnNumber: 7
            }, this),
            showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 p-4 bg-gray-50 border rounded-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-medium mb-3",
                        children: "Générer une nouvelle facture"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Période *"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 288,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "month",
                                        value: form.periode,
                                        onChange: (e)=>setForm((f)=>({
                                                    ...f,
                                                    periode: e.target.value
                                                })),
                                        className: "border rounded px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 289,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Échéance (jours)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: "1",
                                        max: "90",
                                        value: form.echeance_jours,
                                        onChange: (e)=>setForm((f)=>({
                                                    ...f,
                                                    echeance_jours: parseInt(e.target.value || "0", 10)
                                                })),
                                        className: "border rounded px-3 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 296,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 286,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: previewInvoice,
                                disabled: generating || !form.periode,
                                className: "border px-4 py-2 rounded",
                                children: generating ? "…" : "👁️ Prévisualiser"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 309,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: generateInvoice,
                                disabled: generating || !form.periode,
                                className: "bg-green-600 text-white px-4 py-2 rounded",
                                children: generating ? "⏳ Génération…" : "✅ Générer facture"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowForm(false),
                                className: "border px-4 py-2 rounded",
                                children: "Annuler"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 308,
                        columnNumber: 11
                    }, this),
                    preview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-sm text-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "Période : ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: preview.periode
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 320,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 320,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "Dossiers pris en compte : ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: preview.dossiers_count
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 321,
                                        columnNumber: 46
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 321,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    "Montant total commissions : ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: [
                                            num(preview.commission_eur),
                                            "€"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 322,
                                        columnNumber: 48
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 322,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 319,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 284,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-medium text-gray-700 mb-3",
                        children: "📄 Historique des factures"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this),
                    m.factures.toutes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-8 text-gray-500",
                        children: "—"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 332,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "min-w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-gray-50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                                                    children: "Facture"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                    lineNumber: 338,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                                                    children: "Période"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                    lineNumber: 339,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                                                    children: "Montant"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                    lineNumber: 340,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                                                    children: "État"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                    lineNumber: 341,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                                                    children: "Échéance"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                    lineNumber: 342,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                                                    children: "Actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                    lineNumber: 343,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                            lineNumber: 337,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 336,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "bg-white divide-y divide-gray-200",
                                        children: m.factures.toutes.slice(0, 10).map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "hover:bg-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-medium text-gray-900",
                                                                children: [
                                                                    "#",
                                                                    f.id
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                                lineNumber: 350,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-gray-500",
                                                                children: fmt(f.date)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                                lineNumber: 351,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                        lineNumber: 349,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-sm",
                                                        children: f.periode || "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                        lineNumber: 353,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-sm font-medium",
                                                        children: [
                                                            num(f.montant),
                                                            "€"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                        lineNumber: 354,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-sm",
                                                        children: stateBadge(f)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                        lineNumber: 355,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: fmt(f.echeance)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                                lineNumber: 357,
                                                                columnNumber: 23
                                                            }, this),
                                                            f.echeance && new Date(f.echeance) < new Date() && f.statut !== "payee" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-red-600 font-medium",
                                                                children: "En retard"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                                lineNumber: 359,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                        lineNumber: 356,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>download(f),
                                                            className: "bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700",
                                                            children: "📥 PDF"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                            lineNumber: 363,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                        lineNumber: 362,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, f.id, true, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                lineNumber: 348,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 346,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this),
                            m.factures.toutes.length > 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-3 text-sm text-gray-500",
                                children: [
                                    "Et ",
                                    m.factures.toutes.length - 10,
                                    " autres factures…"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 372,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 334,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 329,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-50 rounded-lg p-4 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-medium mb-2",
                        children: "📮 Coordonnées de facturation"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 381,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium",
                                        children: m.coord.societe || m.partner.nom || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 384,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-600",
                                        children: m.coord.adresse || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 385,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 383,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Email:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                lineNumber: 388,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            m.coord.email_facturation || "—"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 388,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Mode paiement:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                lineNumber: 389,
                                                columnNumber: 18
                                            }, this),
                                            " ",
                                            ((_m_partner_paiement = m.partner.paiement) === null || _m_partner_paiement === void 0 ? void 0 : _m_partner_paiement.mode) || "—"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 389,
                                        columnNumber: 13
                                    }, this),
                                    ((_m_partner_paiement1 = m.partner.paiement) === null || _m_partner_paiement1 === void 0 ? void 0 : _m_partner_paiement1.iban) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "IBAN:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                                lineNumber: 390,
                                                columnNumber: 47
                                            }, this),
                                            " ",
                                            m.partner.paiement.iban.slice(0, 8),
                                            "…"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                        lineNumber: 390,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                                lineNumber: 387,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                        lineNumber: 382,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 380,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
        lineNumber: 223,
        columnNumber: 5
    }, this);
}
_s(InvoicesCommissionsCard, "+g4xPCTnDCE6NFaa0E3nsosH5XQ=");
_c = InvoicesCommissionsCard;
function Box(param) {
    let { title, value, subtitle } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-50 border border-gray-200 rounded-lg p-4 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-2xl font-bold text-gray-900",
                children: value
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 401,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm font-medium text-gray-700",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 402,
                columnNumber: 7
            }, this),
            subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-gray-500 mt-1",
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
                lineNumber: 403,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js",
        lineNumber: 400,
        columnNumber: 5
    }, this);
}
_c1 = Box;
var _c, _c1;
__turbopack_context__.k.register(_c, "InvoicesCommissionsCard");
__turbopack_context__.k.register(_c1, "Box");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>EntrepriseCard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
"use client";
;
;
/* ---------- Helpers ---------- */ // Date sûre (retourne "—" si invalide)
function fmt(d) {
    if (!d) return "—";
    const dt = new Date(d);
    if (!Number.isFinite(dt.getTime())) return "—";
    try {
        return dt.toLocaleDateString("fr-FR");
    } catch (e) {
        return "—";
    }
}
// Tri-état booléen, en acceptant 1/0 et strings
function toBoolOrUndef(v) {
    if (v === true || v === false) return v;
    if (v === 1 || v === 0) return Boolean(v);
    if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (s === "true" || s === "oui") return true;
        if (s === "false" || s === "non") return false;
    }
    return undefined;
}
const showBool = (v)=>{
    const b = toBoolOrUndef(v);
    return b === true ? "Oui" : b === false ? "Non" : "—";
};
// Affiche valeur telle quelle, ou "—" si null/undefined/""
const show = (v)=>(v !== null && v !== void 0 ? v : v === 0) ? String(v) : "—";
// Concatène des morceaux (ex: adresse) en filtrant vides/"—"
function joinClean(parts) {
    let sep = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ", ";
    const cleaned = parts.map((x)=>(x !== null && x !== void 0 ? x : x === 0) ? String(x) : "").map((x)=>x.trim()).filter((x)=>x && x !== "—");
    return cleaned.length ? cleaned.join(sep) : "—";
}
function EntrepriseCard(param) {
    let { data } = param;
    var _e_donnees_gouvernement, _e_donnees_gouvernement1, _e_donnees_gouvernement2, _e_donnees_gouvernement3, _e_lieu_exercice, _e_lieu_exercice1, _e_activite, _e_activite1, _e_activite2, _e_activite3, _e_activite4, _e_activite5, _e_dates, _e_dates1, _e_dates2, _e_dates3, _e_dates4, _e_dates5;
    if (!(data === null || data === void 0 ? void 0 : data.entreprise)) return null;
    const e = data.entreprise;
    const docs = Array.isArray(data.documents_generes) ? data.documents_generes : [];
    const jobs = Array.isArray(data.scraping_jobs) ? data.scraping_jobs : [];
    const dossiers = Array.isArray(data.dossiers) ? data.dossiers : [];
    var _e_donnees_gouvernement_guichet_unique_INPI, _ref;
    // Compat: mêmes infos, 2 chemins possibles (tout vient de la BDD)
    const INPI = (_ref = (_e_donnees_gouvernement_guichet_unique_INPI = (_e_donnees_gouvernement = e.donnees_gouvernement) === null || _e_donnees_gouvernement === void 0 ? void 0 : _e_donnees_gouvernement.guichet_unique_INPI) !== null && _e_donnees_gouvernement_guichet_unique_INPI !== void 0 ? _e_donnees_gouvernement_guichet_unique_INPI : e.gov_inpi) !== null && _ref !== void 0 ? _ref : {};
    var _e_donnees_gouvernement_INSEE_SIRENE, _ref1;
    const INSEE = (_ref1 = (_e_donnees_gouvernement_INSEE_SIRENE = (_e_donnees_gouvernement1 = e.donnees_gouvernement) === null || _e_donnees_gouvernement1 === void 0 ? void 0 : _e_donnees_gouvernement1.INSEE_SIRENE) !== null && _e_donnees_gouvernement_INSEE_SIRENE !== void 0 ? _e_donnees_gouvernement_INSEE_SIRENE : e.gov_insee) !== null && _ref1 !== void 0 ? _ref1 : {};
    var _e_donnees_gouvernement_URSSAF, _ref2;
    const URSSAF = (_ref2 = (_e_donnees_gouvernement_URSSAF = (_e_donnees_gouvernement2 = e.donnees_gouvernement) === null || _e_donnees_gouvernement2 === void 0 ? void 0 : _e_donnees_gouvernement2.URSSAF) !== null && _e_donnees_gouvernement_URSSAF !== void 0 ? _e_donnees_gouvernement_URSSAF : e.gov_urssaf) !== null && _ref2 !== void 0 ? _ref2 : {};
    var _e_donnees_gouvernement_RNE, _ref3;
    const RNE = (_ref3 = (_e_donnees_gouvernement_RNE = (_e_donnees_gouvernement3 = e.donnees_gouvernement) === null || _e_donnees_gouvernement3 === void 0 ? void 0 : _e_donnees_gouvernement3.RNE) !== null && _e_donnees_gouvernement_RNE !== void 0 ? _e_donnees_gouvernement_RNE : e.gov_rne) !== null && _ref3 !== void 0 ? _ref3 : {};
    var _e_options_fiscales;
    const TVA = (_e_options_fiscales = e.options_fiscales) !== null && _e_options_fiscales !== void 0 ? _e_options_fiscales : {};
    var _e_checklist_conformite;
    const check = (_e_checklist_conformite = e.checklist_conformite) !== null && _e_checklist_conformite !== void 0 ? _e_checklist_conformite : {};
    const tit = e.titulaire_client;
    var _e_lieu_exercice_adresse_etablissement, _ref4;
    // Adresse: on construit proprement sans “—, — —”
    const adr = (_ref4 = (_e_lieu_exercice_adresse_etablissement = (_e_lieu_exercice = e.lieu_exercice) === null || _e_lieu_exercice === void 0 ? void 0 : _e_lieu_exercice.adresse_etablissement) !== null && _e_lieu_exercice_adresse_etablissement !== void 0 ? _e_lieu_exercice_adresse_etablissement : (_e_lieu_exercice1 = e.lieu_exercice) === null || _e_lieu_exercice1 === void 0 ? void 0 : _e_lieu_exercice1.adresse) !== null && _ref4 !== void 0 ? _ref4 : {};
    const adresseLigne = joinClean([
        adr.ligne1,
        adr.code_postal,
        adr.ville
    ], " ");
    var _e_activite_description, _ref5;
    // Activité: description/libellé avec fallback net
    const activiteLabel = (_ref5 = (_e_activite_description = (_e_activite = e.activite) === null || _e_activite === void 0 ? void 0 : _e_activite.description) !== null && _e_activite_description !== void 0 ? _e_activite_description : (_e_activite1 = e.activite) === null || _e_activite1 === void 0 ? void 0 : _e_activite1.libelle) !== null && _ref5 !== void 0 ? _ref5 : "";
    var _INSEE_SIREN;
    // INSEE/SIRENE: champs normalisés
    const siren = (_INSEE_SIREN = INSEE.SIREN) !== null && _INSEE_SIREN !== void 0 ? _INSEE_SIREN : INSEE.siren;
    var _INSEE_SIRET_principal;
    const siret = (_INSEE_SIRET_principal = INSEE.SIRET_principal) !== null && _INSEE_SIRET_principal !== void 0 ? _INSEE_SIRET_principal : INSEE.siret;
    var _INSEE_code_APE;
    const ape = (_INSEE_code_APE = INSEE.code_APE) !== null && _INSEE_code_APE !== void 0 ? _INSEE_code_APE : INSEE.ape;
    var _URSSAF_affiliation;
    // URSSAF: n° affiché uniquement s’il existe
    const urssafStatut = (_URSSAF_affiliation = URSSAF.affiliation) !== null && _URSSAF_affiliation !== void 0 ? _URSSAF_affiliation : URSSAF.statut;
    var _URSSAF_numero_affiliation;
    const urssafNumero = (_URSSAF_numero_affiliation = URSSAF.numero_affiliation) !== null && _URSSAF_numero_affiliation !== void 0 ? _URSSAF_numero_affiliation : URSSAF.numero_compte;
    var _e_options_sociales;
    // Options sociales: gardes simples
    const os = (_e_options_sociales = e.options_sociales) !== null && _e_options_sociales !== void 0 ? _e_options_sociales : {};
    var _e_activite_APE_NAF, _e_dates_date_demande, _e_dates_date_debut_activite, _e_dates_date_immatriculation_reelle, _os_periodicite_versement, _TVA_franchise_TVA, _TVA_numero_TVA_intracom, _TVA_versement_liberatoire_IR, _INPI_etat, _INPI_numero_dossier, _INPI_derniere_mise_a_jour, _RNE_inscription;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold mb-4",
                children: "🏢 Mon entreprise"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border rounded p-4 space-y-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b pb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-semibold text-lg",
                                children: show(e.denomination)
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-4 text-sm text-gray-600 mt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Forme:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                                lineNumber: 93,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            show(e.forme)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Statut:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                                lineNumber: 94,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            show(e.statut_dossier)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Titulaire:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this),
                                            " ",
                                            tit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/crm/clients/".concat(tit.id),
                                                className: "underline",
                                                children: show(joinClean([
                                                    tit.prenom,
                                                    tit.nom
                                                ], " "))
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                                lineNumber: 98,
                                                columnNumber: 17
                                            }, this) : "—"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                className: "font-medium text-blue-800 mb-2",
                                children: "📍 Activité & lieu"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "list-disc pl-6 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Activité: ",
                                            show(activiteLabel)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 110,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Catégorie: ",
                                            show((_e_activite2 = e.activite) === null || _e_activite2 === void 0 ? void 0 : _e_activite2.categorie),
                                            " — APE/NAF: ",
                                            show((_e_activite_APE_NAF = (_e_activite3 = e.activite) === null || _e_activite3 === void 0 ? void 0 : _e_activite3.APE_NAF) !== null && _e_activite_APE_NAF !== void 0 ? _e_activite_APE_NAF : (_e_activite4 = e.activite) === null || _e_activite4 === void 0 ? void 0 : _e_activite4.code_ape)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Réglem.: ",
                                            showBool((_e_activite5 = e.activite) === null || _e_activite5 === void 0 ? void 0 : _e_activite5.profession_reglementee)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Établissement: ",
                                            adresseLigne
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                className: "font-medium text-green-800 mb-2",
                                children: "📅 Dates importantes"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "list-disc pl-6 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Demande: ",
                                            fmt((_e_dates_date_demande = (_e_dates = e.dates) === null || _e_dates === void 0 ? void 0 : _e_dates.date_demande) !== null && _e_dates_date_demande !== void 0 ? _e_dates_date_demande : (_e_dates1 = e.dates) === null || _e_dates1 === void 0 ? void 0 : _e_dates1.demande)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 121,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Début d’activité: ",
                                            fmt((_e_dates_date_debut_activite = (_e_dates2 = e.dates) === null || _e_dates2 === void 0 ? void 0 : _e_dates2.date_debut_activite) !== null && _e_dates_date_debut_activite !== void 0 ? _e_dates_date_debut_activite : (_e_dates3 = e.dates) === null || _e_dates3 === void 0 ? void 0 : _e_dates3.debut_activite)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 122,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Immatriculation réelle: ",
                                            fmt((_e_dates_date_immatriculation_reelle = (_e_dates4 = e.dates) === null || _e_dates4 === void 0 ? void 0 : _e_dates4.date_immatriculation_reelle) !== null && _e_dates_date_immatriculation_reelle !== void 0 ? _e_dates_date_immatriculation_reelle : (_e_dates5 = e.dates) === null || _e_dates5 === void 0 ? void 0 : _e_dates5.immatriculation_reelle)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    (e.options_sociales || e.options_fiscales) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                className: "font-medium text-purple-800 mb-2",
                                children: "⚖️ Options sociales & fiscales"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "list-disc pl-6 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Régime: ",
                                            show(os.regime)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Périodicité: ",
                                            show((_os_periodicite_versement = os.periodicite_versement) !== null && _os_periodicite_versement !== void 0 ? _os_periodicite_versement : os.periodicite)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Franchise TVA: ",
                                            showBool((_TVA_franchise_TVA = TVA.franchise_TVA) !== null && _TVA_franchise_TVA !== void 0 ? _TVA_franchise_TVA : TVA.franchise_tva)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 134,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "N° TVA intracom: ",
                                            show((_TVA_numero_TVA_intracom = TVA.numero_TVA_intracom) !== null && _TVA_numero_TVA_intracom !== void 0 ? _TVA_numero_TVA_intracom : TVA.numero_tva)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Versement libératoire IR: ",
                                            showBool((_TVA_versement_liberatoire_IR = TVA.versement_liberatoire_IR) !== null && _TVA_versement_liberatoire_IR !== void 0 ? _TVA_versement_liberatoire_IR : TVA.versement_liberatoire)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Compta simplifiée: ",
                                            showBool(TVA.comptabilite_simplifiee)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                className: "font-medium text-red-800 mb-2",
                                children: "🏛️ Données gouvernement"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "list-disc pl-6 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "INPI: ",
                                            show((_INPI_etat = INPI.etat) !== null && _INPI_etat !== void 0 ? _INPI_etat : INPI.statut),
                                            " — dossier ",
                                            show((_INPI_numero_dossier = INPI.numero_dossier) !== null && _INPI_numero_dossier !== void 0 ? _INPI_numero_dossier : INPI.dossier),
                                            " — MAJ ",
                                            fmt((_INPI_derniere_mise_a_jour = INPI.derniere_mise_a_jour) !== null && _INPI_derniere_mise_a_jour !== void 0 ? _INPI_derniere_mise_a_jour : INPI.derniere_maj)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "INSEE/SIRENE — SIREN ",
                                            show(siren),
                                            ", SIRET ",
                                            show(siret),
                                            ", APE ",
                                            show(ape)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "URSSAF — ",
                                            show(urssafStatut),
                                            urssafNumero ? ", n° ".concat(urssafNumero) : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "RNE — ",
                                            show((_RNE_inscription = RNE.inscription) !== null && _RNE_inscription !== void 0 ? _RNE_inscription : RNE.statut)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    check && Object.keys(check).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                className: "font-medium text-green-800 mb-2",
                                children: "✅ Conformité (checklist)"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid md:grid-cols-2 gap-2 text-sm",
                                children: Object.entries(check).map((param)=>{
                                    let [k, v] = param;
                                    const ok = v === "ok" || v === true || v === 1 || typeof v === "string" && v.toLowerCase() === "true";
                                    const ko = v === "ko" || v === false || v === 0 || typeof v === "string" && v.toLowerCase() === "false";
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: ok ? "text-green-600" : ko ? "text-red-600" : "text-gray-500",
                                                children: ok ? "✅" : ko ? "❌" : "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                                lineNumber: 170,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    k.replace(/_/g, " "),
                                                    ": ",
                                                    show(v)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                                lineNumber: 173,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, k, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 169,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                className: "font-medium text-gray-800 mb-2",
                                children: "📋 Documents générés"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            docs.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-1 text-sm",
                                children: docs.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            fmt(d.date),
                                            " — ",
                                            show(d.type),
                                            " — ",
                                            show(d.fichier),
                                            " — source ",
                                            show(d.source)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600",
                                children: "—"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                className: "font-medium text-gray-800 mb-2",
                                children: "🕸️ Scraping jobs"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            jobs.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-1 text-sm",
                                children: jobs.map((j)=>{
                                    var _j_updated_at, _j_id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            show(j.portail),
                                            " — ",
                                            show(j.etat),
                                            " — ",
                                            show(j.last_event),
                                            " — MAJ ",
                                            fmt(j.updated_at)
                                        ]
                                    }, (_j_id = j.id) !== null && _j_id !== void 0 ? _j_id : "".concat(j.portail, "-").concat((_j_updated_at = j.updated_at) !== null && _j_updated_at !== void 0 ? _j_updated_at : ""), true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 203,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600",
                                children: "—"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                className: "font-medium text-gray-800 mb-2",
                                children: "📂 Dossiers reliés"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            dossiers.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-1 text-sm",
                                children: dossiers.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Dossier #",
                                            show(d.id),
                                            " — statut ",
                                            show(d.statut),
                                            " — client",
                                            " ",
                                            d.client_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                className: "underline",
                                                href: "/crm/clients/".concat(d.client_id),
                                                children: [
                                                    "#",
                                                    show(d.client_id)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                                lineNumber: 222,
                                                columnNumber: 21
                                            }, this) : "—"
                                        ]
                                    }, d.id, true, {
                                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                        lineNumber: 219,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600",
                                children: "—"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_c = EntrepriseCard;
var _c;
__turbopack_context__.k.register(_c, "EntrepriseCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(crm)/crm/dashboard/page.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>Dashboard
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
/* ====== COMPOSANTS RÉUTILISÉS (chemins relatifs depuis /dashboard) ====== */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$DossierTimeline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/crm/clients/[id]/DossierTimeline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$ClientIdentityCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/crm/clients/[id]/ClientIdentityCard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$PiecesJustificativesCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/crm/clients/[id]/PiecesJustificativesCard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$CommsHistory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/crm/clients/[id]/CommsHistory.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$ClientMessaging$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/crm/clients/[id]/ClientMessaging.js [app-client] (ecmascript)");
// 👉 côté partenaire
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$partenaires$2f5b$id$5d2f$PartnerTracking$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/crm/partenaires/[id]/PartnerTracking.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$partenaires$2f5b$id$5d2f$InvoicesCommissionsCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/crm/partenaires/[id]/InvoicesCommissionsCard.js [app-client] (ecmascript)");
// 👉 carte entreprise existante
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$entreprises$2f5b$id$5d2f$EntrepriseCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(crm)/crm/entreprises/[id]/EntrepriseCard.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
/* ====== UTILS ====== */ function parseISO(d) {
    return d ? new Date(d) : null;
}
function inRange(d, from, to) {
    if (!d) return true;
    const dt = typeof d === "string" ? new Date(d) : d;
    if (from && dt < from) return false;
    if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (dt > end) return false;
    }
    return true;
}
const fmt = (d)=>d ? new Date(d).toLocaleString("fr-FR") : "-";
function euro(n) {
    if (n === 0) return "0€";
    if (n == null) return "—";
    return "".concat(Number(n).toLocaleString("fr-FR"), "€");
}
function safe(s) {
    return s !== null && s !== void 0 ? s : "—";
}
/* ====== CARTES ALERTE & ACTIVITÉ ====== */ function AlertCard(param) {
    let { alert: alert1, onAction } = param;
    const getAlertStyle = (priority)=>{
        switch(priority){
            case 'critical':
                return 'border-red-500 bg-red-50';
            case 'important':
                return 'border-orange-500 bg-orange-50';
            case 'info':
                return 'border-blue-500 bg-blue-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };
    const getAlertIcon = (priority)=>{
        switch(priority){
            case 'critical':
                return '🔴';
            case 'important':
                return '🟡';
            case 'info':
                return '🔵';
            default:
                return '⚪';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-l-4 p-3 rounded ".concat(getAlertStyle(alert1.priority)),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: getAlertIcon(alert1.priority)
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold",
                                children: alert1.title
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "text-xs bg-white px-2 py-1 rounded border",
                        onClick: ()=>onAction(alert1),
                        children: alert1.action === 'traiter' ? '🔧 Traiter' : alert1.action === 'assigner' ? '👤 Assigner' : alert1.action === 'relancer' ? '📞 Relancer' : '👀 Voir'
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-600 mb-2",
                children: alert1.description
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            alert1.items && alert1.items.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    alert1.items.slice(0, 3).map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs bg-white p-2 rounded",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.link,
                                    className: "font-medium text-blue-600 hover:underline",
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-500",
                                    children: item.detail
                                }, void 0, false, {
                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this)),
                    alert1.items.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500 text-center",
                        children: [
                            "+",
                            alert1.items.length - 3,
                            " autres..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 80,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 70,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c = AlertCard;
function ActivityCard(param) {
    let { activity } = param;
    const getActivityColor = (color)=>{
        switch(color){
            case 'blue':
                return 'border-l-blue-500 bg-blue-50';
            case 'green':
                return 'border-l-green-500 bg-green-50';
            case 'yellow':
                return 'border-l-yellow-500 bg-yellow-50';
            case 'orange':
                return 'border-l-orange-500 bg-orange-50';
            default:
                return 'border-l-gray-500 bg-gray-50';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-l-4 p-2 rounded ".concat(getActivityColor(activity.color)),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: activity.icon
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: activity.link,
                                className: "font-medium text-blue-600 hover:underline",
                                children: activity.title
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-500",
                        children: fmt(activity.timestamp).replace(/:\d{2}$/, '')
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-gray-600 ml-6",
                children: activity.description
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            activity.detail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-gray-500 ml-6 mt-1",
                children: activity.detail
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 115,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_c1 = ActivityCard;
function Dashboard() {
    var _data_refs;
    _s();
    // États filtres & data
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [partnerId, setPartnerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [operatorId, setOperatorId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [dateFrom, setDateFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dateTo, setDateTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isLoading = !data && !err;
    // Alertes & activités
    const [alerts, setAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [alertsLoading, setAlertsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showAllAlerts, setShowAllAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
            const r = await fetch("/api/dashboard?".concat(qs.toString()), {
                cache: "no-store"
            });
            if (!r.ok) throw new Error("HTTP ".concat(r.status));
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
                fetch("/api/alerts", {
                    cache: "no-store"
                }),
                fetch("/api/recent-activities", {
                    cache: "no-store"
                })
            ]);
            if (alertsRes.ok) setAlerts(await alertsRes.json());
            if (activitiesRes.ok) {
                const a = await activitiesRes.json();
                setActivities(a.activities || []);
            }
        } catch (e) {
            console.error("Erreur chargement alertes:", e);
        } finally{
            setAlertsLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            load();
            loadAlerts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Dashboard.useEffect"], [
        status,
        partnerId,
        operatorId,
        dateFrom,
        dateTo
    ]);
    // Actions
    async function changeStatut(dossierId, newStatut) {
        await fetch("/api/dossiers/".concat(dossierId), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                statut: newStatut
            })
        });
        await load();
        await loadAlerts();
    }
    async function createTicket(dossierId, clientNom) {
        const subject = prompt("Sujet du ticket:", "Support client ".concat(clientNom || 'Inconnu'));
        if (!subject) return;
        try {
            await fetch("/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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
        await fetch("/api/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
            const url = "/api/exports/dossiers?".concat(qs.toString());
            const link = document.createElement("a");
            link.href = url;
            link.download = "dossiers_".concat(new Date().toISOString().slice(0, 10), ".csv");
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
        switch(a.action){
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
    var _data_partenaires;
    // Référentiels
    const partners = (_data_partenaires = data === null || data === void 0 ? void 0 : data.partenaires) !== null && _data_partenaires !== void 0 ? _data_partenaires : [];
    var _data_operateurs;
    const operators = (_data_operateurs = data === null || data === void 0 ? void 0 : data.operateurs) !== null && _data_operateurs !== void 0 ? _data_operateurs : [];
    var _data_dossiers;
    const dossiers = (_data_dossiers = data === null || data === void 0 ? void 0 : data.dossiers) !== null && _data_dossiers !== void 0 ? _data_dossiers : [];
    var _data_clients;
    const clients = (_data_clients = data === null || data === void 0 ? void 0 : data.clients) !== null && _data_clients !== void 0 ? _data_clients : [];
    var _data_refs_statuts_dossier;
    const statusesRef = (_data_refs_statuts_dossier = data === null || data === void 0 ? void 0 : (_data_refs = data.refs) === null || _data_refs === void 0 ? void 0 : _data_refs.statuts_dossier) !== null && _data_refs_statuts_dossier !== void 0 ? _data_refs_statuts_dossier : [];
    var _data_notifications_queue;
    const notifications = (_data_notifications_queue = data === null || data === void 0 ? void 0 : data.notifications_queue) !== null && _data_notifications_queue !== void 0 ? _data_notifications_queue : [];
    var _data_auth_logs;
    const authLogs = (_data_auth_logs = data === null || data === void 0 ? void 0 : data.auth_logs) !== null && _data_auth_logs !== void 0 ? _data_auth_logs : [];
    // Filtres
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Dashboard.useMemo[filtered]": ()=>{
            const from = dateFrom ? parseISO(dateFrom) : null;
            const to = dateTo ? parseISO(dateTo) : null;
            return dossiers.filter({
                "Dashboard.useMemo[filtered]": (d)=>{
                    const okStatus = status === "all" ? true : d.statut === status;
                    const okPartner = partnerId === "all" ? true : String(d.partenaireId) === String(partnerId);
                    const okOperator = operatorId === "all" ? true : String(d.operateurId) === String(operatorId);
                    const okDate = inRange(d.date_creation, from, to);
                    return okStatus && okPartner && okOperator && okDate;
                }
            }["Dashboard.useMemo[filtered]"]);
        }
    }["Dashboard.useMemo[filtered]"], [
        dossiers,
        status,
        partnerId,
        operatorId,
        dateFrom,
        dateTo
    ]);
    const kpis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Dashboard.useMemo[kpis]": ()=>{
            const counts = {};
            (statusesRef.length ? statusesRef : Array.from(new Set(dossiers.map({
                "Dashboard.useMemo[kpis]": (d)=>d.statut
            }["Dashboard.useMemo[kpis]"])))).forEach({
                "Dashboard.useMemo[kpis]": (s)=>counts[s] = 0
            }["Dashboard.useMemo[kpis]"]);
            filtered.forEach({
                "Dashboard.useMemo[kpis]": (d)=>counts[d.statut] = (counts[d.statut] || 0) + 1
            }["Dashboard.useMemo[kpis]"]);
            return counts;
        }
    }["Dashboard.useMemo[kpis]"], [
        filtered,
        dossiers,
        statusesRef
    ]);
    const clientById = (id)=>clients.find((c)=>String(c.id) === String(id));
    const partById = (id)=>partners.find((p)=>String(p.id) === String(id));
    const resetFilters = ()=>{
        setStatus("all");
        setPartnerId("all");
        setOperatorId("all");
        setDateFrom("");
        setDateTo("");
    };
    if (err) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-bold",
                children: "Erreur"
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 315,
                columnNumber: 41
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                className: "mt-2",
                children: err
            }, void 0, false, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 315,
                columnNumber: 86
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
        lineNumber: 315,
        columnNumber: 19
    }, this);
    if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-6",
        children: "Chargement…"
    }, void 0, false, {
        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
        lineNumber: 316,
        columnNumber: 25
    }, this);
    // Alertes à afficher
    const allAlerts = alerts ? [
        ...alerts.alerts.critical,
        ...alerts.alerts.important,
        ...showAllAlerts ? alerts.alerts.info : []
    ] : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-6 space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: "CRM — Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/crm/tickets",
                        className: "text-sm text-blue-600 underline",
                        children: "→ Voir tous les tickets"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: loadAlerts,
                        className: "text-sm bg-blue-600 text-white px-3 py-1 rounded",
                        disabled: alertsLoading,
                        children: alertsLoading ? "🔄" : "🔄 Actualiser alertes"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            alerts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold",
                                children: "🚨 Alertes prioritaires"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 339,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 text-sm",
                                children: [
                                    alerts.summary.critical > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-red-100 text-red-800 px-2 py-1 rounded",
                                        children: [
                                            "🔴 ",
                                            alerts.summary.critical,
                                            " critiques"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 341,
                                        columnNumber: 47
                                    }, this),
                                    alerts.summary.important > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-orange-100 text-orange-800 px-2 py-1 rounded",
                                        children: [
                                            "🟡 ",
                                            alerts.summary.important,
                                            " importantes"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 342,
                                        columnNumber: 48
                                    }, this),
                                    alerts.summary.info > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-blue-100 text-blue-800 px-2 py-1 rounded",
                                        children: [
                                            "🔵 ",
                                            alerts.summary.info,
                                            " info"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 343,
                                        columnNumber: 43
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 340,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 338,
                        columnNumber: 11
                    }, this),
                    allAlerts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-green-50 border border-green-200 rounded p-4 text-center",
                        children: "✅ Aucune alerte critique ou importante ! Tout va bien."
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 348,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-4",
                        children: allAlerts.map((alert1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertCard, {
                                alert: alert1,
                                onAction: handleAlertAction
                            }, alert1.id, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 354,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 352,
                        columnNumber: 13
                    }, this),
                    alerts.summary.info > 0 && !showAllAlerts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowAllAlerts(true),
                            className: "text-sm text-blue-600 underline",
                            children: [
                                "+ Voir les ",
                                alerts.summary.info,
                                " alertes informatives"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                            lineNumber: 361,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 360,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 337,
                columnNumber: 9
            }, this),
            activities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-4",
                        children: "📊 Activité récente"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-3",
                        children: activities.slice(0, 6).map((activity, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActivityCard, {
                                activity: activity
                            }, i, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 375,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 373,
                        columnNumber: 11
                    }, this),
                    activities.length > 6 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mt-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/crm/activities",
                            className: "text-sm text-blue-600 underline",
                            children: "Voir toute l'activité →"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                            lineNumber: 380,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 379,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 371,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "border rounded p-4 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-5 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Statut"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 390,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "border rounded p-2",
                                        value: status,
                                        onChange: (e)=>setStatus(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "Tous"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 392,
                                                columnNumber: 15
                                            }, this),
                                            (statusesRef.length ? statusesRef : Array.from(new Set(dossiers.map((d)=>d.statut)))).map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: s,
                                                    children: s
                                                }, s, false, {
                                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                    lineNumber: 394,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 391,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 389,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Partenaire"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 400,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "border rounded p-2",
                                        value: partnerId,
                                        onChange: (e)=>setPartnerId(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "Tous"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 402,
                                                columnNumber: 15
                                            }, this),
                                            partners.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: p.id,
                                                    children: p.nom
                                                }, p.id, false, {
                                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                    lineNumber: 403,
                                                    columnNumber: 34
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Opérateur"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 408,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "border rounded p-2",
                                        value: operatorId,
                                        onChange: (e)=>setOperatorId(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "Tous"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 410,
                                                columnNumber: 15
                                            }, this),
                                            operators.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: o.id,
                                                    children: o.nom
                                                }, o.id, false, {
                                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                    lineNumber: 411,
                                                    columnNumber: 35
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 409,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 407,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Du"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 416,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        className: "border rounded p-2",
                                        value: dateFrom,
                                        onChange: (e)=>setDateFrom(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 417,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 415,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex flex-col text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mb-1 font-medium",
                                        children: "Au"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 421,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        className: "border rounded p-2",
                                        value: dateTo,
                                        onChange: (e)=>setDateTo(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 422,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "border rounded px-3 py-2",
                                onClick: resetFilters,
                                children: "Réinitialiser"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 427,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "bg-green-600 text-white px-3 py-2 rounded",
                                onClick: exportDossiers,
                                children: [
                                    "📊 Exporter CSV (",
                                    filtered.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 428,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-600 self-center",
                                children: [
                                    filtered.length,
                                    " dossier(s) sur ",
                                    dossiers.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 426,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 387,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-2",
                        children: "KPIs dossiers (filtrés)"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 437,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap",
                        children: [
                            Object.entries(kpis).map((param)=>{
                                let [s, n] = param;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-600",
                                            children: s
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                            lineNumber: 441,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-2xl font-bold",
                                            children: n
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                            lineNumber: 442,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, s, true, {
                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                    lineNumber: 440,
                                    columnNumber: 13
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: "Total"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 446,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold",
                                        children: filtered.length
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 447,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 445,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 438,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 436,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-2",
                        children: "Dossiers"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 454,
                        columnNumber: 9
                    }, this),
                    filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: "Aucun résultat avec ces filtres."
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 456,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 space-y-3",
                        children: filtered.map((d)=>{
                            const client = clientById(d.clientId);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DossierRow, {
                                dossier: d,
                                client: client,
                                partner: partById(d.partenaireId),
                                changeStatut: changeStatut,
                                createTicket: createTicket,
                                planRelance: planRelance
                            }, d.id, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 462,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 458,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 453,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-2",
                        children: "Notifications & relances programmées"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 space-y-1",
                        children: notifications.length ? notifications.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    n.type,
                                    " — client",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "underline",
                                        href: "/crm/clients/".concat(n.clientId),
                                        children: [
                                            "#",
                                            n.clientId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 484,
                                        columnNumber: 15
                                    }, this),
                                    " ",
                                    "— ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "italic text-gray-700",
                                        children: [
                                            '"',
                                            n.message || "—",
                                            '"'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 487,
                                        columnNumber: 17
                                    }, this),
                                    " — dossier #",
                                    n.dossierId,
                                    " — ",
                                    n.canal,
                                    " — prévu le",
                                    " ",
                                    new Date(n.scheduled_for).toLocaleString("fr-FR")
                                ]
                            }, n.id, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 482,
                                columnNumber: 13
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "Aucune notification programmée."
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                            lineNumber: 491,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 480,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 478,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-2",
                        children: "Tickets récents"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 499,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/crm/tickets",
                            className: "underline",
                            children: "Voir tous les tickets →"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                            lineNumber: 501,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 498,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-2",
                        children: "Connexions (sécurité)"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 507,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 space-y-1",
                        children: authLogs.length ? authLogs.map((l, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    l.at,
                                    " — ",
                                    l.role,
                                    " ",
                                    l.who,
                                    " — ",
                                    l.action,
                                    " — ",
                                    l.success ? "✅" : "❌",
                                    " — IP ",
                                    l.ip
                                ]
                            }, i, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 510,
                                columnNumber: 13
                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "Aucune entrée"
                        }, void 0, false, {
                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                            lineNumber: 511,
                            columnNumber: 16
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 508,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 506,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
        lineNumber: 326,
        columnNumber: 5
    }, this);
}
_s(Dashboard, "6xeAsxVnujbDy5RbfTMFrisLK4k=");
_c2 = Dashboard;
function DossierRow(param) {
    let { dossier, client, partner, changeStatut, createTicket, planRelance } = param;
    var _p_referent, _p_referent1, _p_referent2, _p_paiement, _p_paiement1, _p_paiement2, _p_contrat, _p_contrat1, _p_contrat2, _p_coordonnees_facturation, _p_coordonnees_facturation1, _p_coordonnees_facturation2, _details_client, _details_client1, _details_client2, _details_client3;
    _s1();
    const [showRelanceModal, setShowRelanceModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [relanceMessage, setRelanceMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    async function envoyerRelance() {
        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "relance_piece",
                    client_id: dossier.clientId,
                    dossier_id: dossier.id,
                    canal: "email",
                    scheduled_for: new Date().toISOString(),
                    message: relanceMessage || "Pas de message fourni"
                })
            });
            if (!res.ok) throw new Error("HTTP ".concat(res.status));
            // ✅ AJOUTEZ CES LIGNES :
            // Recharger les données du client pour voir la nouvelle notification
            if (details && dossier.clientId) {
                const r = await fetch("/api/clients/".concat(dossier.clientId), {
                    cache: "no-store"
                });
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
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // panneau client/dossier
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [details, setDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 🏢 État pour la fiche entreprise inline (CE QUI MANQUAIT)
    const [entrepriseCard, setEntrepriseCard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [entrepriseCardLoading, setEntrepriseCardLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [entrepriseCardErr, setEntrepriseCardErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 👇 panneau partenaire (au clic sur le nom)
    const [pOpen, setPOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pLoading, setPLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pErr, setPErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pDetails, setPDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // charge fiche client/dossier quand on ouvre "Voir plus"
    async function toggle() {
        if (open) {
            setOpen(false);
            return;
        }
        setOpen(true);
        if (details) return; // déjà chargé
        try {
            setLoading(true);
            setErr(null);
            const r = await fetch("/api/clients/".concat(dossier.clientId), {
                cache: "no-store"
            });
            const j = await r.json();
            if (!r.ok) throw new Error(j.error || "HTTP ".concat(r.status));
            setDetails(j);
        } catch (e) {
            setErr(String(e.message || e));
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DossierRow.useEffect": ()=>{
            if (!open) return;
            const eid = dossier === null || dossier === void 0 ? void 0 : dossier.entrepriseId;
            if (!eid || entrepriseCard) return; // déjà chargé ou pas d'entreprise
            let cancelled = false;
            ({
                "DossierRow.useEffect": async ()=>{
                    try {
                        setEntrepriseCardLoading(true);
                        const r = await fetch("/api/entreprises/".concat(eid), {
                            cache: "no-store"
                        });
                        const j = await r.json().catch({
                            "DossierRow.useEffect": ()=>({})
                        }["DossierRow.useEffect"]);
                        if (!r.ok) throw new Error(j.error || r.statusText);
                        if (!cancelled) setEntrepriseCard(j);
                    } catch (e) {
                        if (!cancelled) setEntrepriseCardErr(String(e.message || e));
                    } finally{
                        if (!cancelled) setEntrepriseCardLoading(false);
                    }
                }
            })["DossierRow.useEffect"]();
            return ({
                "DossierRow.useEffect": ()=>{
                    cancelled = true;
                }
            })["DossierRow.useEffect"];
        }
    }["DossierRow.useEffect"], [
        open,
        dossier === null || dossier === void 0 ? void 0 : dossier.entrepriseId,
        entrepriseCard
    ]); // ⚠️ taille FIXE (3)
    // charge fiche partenaire quand on clique sur le nom
    async function togglePartner(e) {
        e.preventDefault();
        e.stopPropagation();
        if (pOpen) {
            setPOpen(false);
            return;
        }
        setPOpen(true);
        if (pDetails) return; // déjà chargé
        try {
            setPLoading(true);
            setPErr(null);
            const r = await fetch("/api/partenaires/".concat(dossier.partenaireId), {
                cache: "no-store"
            });
            const j = await r.json().catch(()=>({}));
            if (!r.ok) throw new Error(j.error || r.statusText);
            setPDetails(j);
        } catch (e) {
            setPErr(String(e.message || e));
        } finally{
            setPLoading(false);
        }
    }
    var _client_prenom, _client_nom;
    const clientNom = client ? "".concat((_client_prenom = client.prenom) !== null && _client_prenom !== void 0 ? _client_prenom : "", " ").concat((_client_nom = client.nom) !== null && _client_nom !== void 0 ? _client_nom : "").trim() || "#".concat(client.id) : "#".concat(dossier.clientId);
    // helpers partenaire
    const p = (pDetails === null || pDetails === void 0 ? void 0 : pDetails.partenaire) || {};
    const docs = p.docs || {};
    var _dossier_derniere_modification, _dossier_commission_partenaire_eur, _p_taux_commission, _p_contrat_duree_mois;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold",
                        children: [
                            "#",
                            dossier.id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 650,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "— statut: ",
                            dossier.statut
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 651,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "— créé: ",
                            dossier.date_creation
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 652,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "— modif: ",
                            (_dossier_derniere_modification = dossier.derniere_modification) !== null && _dossier_derniere_modification !== void 0 ? _dossier_derniere_modification : "-"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 653,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "— client: ",
                            client ? clientNom : dossier.clientId
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 654,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "— partenaire:",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: togglePartner,
                                className: "underline text-blue-600 hover:text-blue-800",
                                title: "Afficher les infos du partenaire",
                                children: partner ? partner.nom : dossier.partenaireId
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 659,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 657,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "— entreprise: #",
                            dossier.entrepriseId
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 669,
                        columnNumber: 9
                    }, this),
                    (dossier.blocages || []).length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "— blocages: ",
                            (dossier.blocages || []).join(", ")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 670,
                        columnNumber: 44
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "— commission: ",
                            (_dossier_commission_partenaire_eur = dossier.commission_partenaire_eur) !== null && _dossier_commission_partenaire_eur !== void 0 ? _dossier_commission_partenaire_eur : 0,
                            "€"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 671,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inline-flex gap-2 ml-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "border rounded px-1 py-0.5 text-sm",
                                value: dossier.statut,
                                onChange: (e)=>changeStatut(dossier.id, e.target.value),
                                children: [
                                    "nouveau",
                                    "en_cours",
                                    "en_attente",
                                    "a_corriger",
                                    "valide",
                                    "rejete"
                                ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: s,
                                        children: s
                                    }, s, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 681,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 675,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "border rounded px-2 py-0.5 text-sm",
                                onClick: ()=>setShowRelanceModal(true),
                                children: "📩 Relancer"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 687,
                                columnNumber: 10
                            }, this),
                            showRelanceModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-lg shadow-lg p-6 w-96",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold mb-4",
                                            children: "Relancer le client"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                            lineNumber: 697,
                                            columnNumber: 7
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: relanceMessage,
                                            onChange: (e)=>setRelanceMessage(e.target.value),
                                            placeholder: "Votre message...",
                                            className: "border rounded w-full p-2 mb-4 h-24"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                            lineNumber: 698,
                                            columnNumber: 7
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-end gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowRelanceModal(false),
                                                    className: "px-3 py-1 rounded bg-gray-200 hover:bg-gray-300",
                                                    children: "Annuler"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                    lineNumber: 705,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: envoyerRelance,
                                                    className: "px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700",
                                                    children: "Envoyer"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                    lineNumber: 711,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                            lineNumber: 704,
                                            columnNumber: 7
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                    lineNumber: 696,
                                    columnNumber: 5
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 695,
                                columnNumber: 3
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "border rounded px-2 py-0.5 text-sm",
                                onClick: toggle,
                                children: open ? "Masquer" : "Voir plus"
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 725,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 674,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 649,
                columnNumber: 7
            }, this),
            pOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 border-l-2 pl-4",
                children: [
                    pLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-500",
                        children: "Chargement…"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 734,
                        columnNumber: 24
                    }, this),
                    pErr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-red-600",
                        children: [
                            "❌ ",
                            pErr
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 735,
                        columnNumber: 20
                    }, this),
                    !pLoading && !pErr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "bg-gray-50 rounded p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1",
                                        children: "🤝 Partenaire"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 741,
                                        columnNumber: 17
                                    }, this),
                                    p && Object.keys(p).length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: p.nom || "#".concat(dossier.partenaireId)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                        lineNumber: 744,
                                                        columnNumber: 26
                                                    }, this),
                                                    " — segment ",
                                                    p.segment || "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 744,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Référent: ",
                                                    ((_p_referent = p.referent) === null || _p_referent === void 0 ? void 0 : _p_referent.nom) || "—",
                                                    " — ",
                                                    ((_p_referent1 = p.referent) === null || _p_referent1 === void 0 ? void 0 : _p_referent1.email) || "—",
                                                    " — ",
                                                    ((_p_referent2 = p.referent) === null || _p_referent2 === void 0 ? void 0 : _p_referent2.telephone) || "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 745,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Taux commission: ",
                                                    (_p_taux_commission = p.taux_commission) !== null && _p_taux_commission !== void 0 ? _p_taux_commission : "—",
                                                    "% • Facturation: ",
                                                    p.type_facturation || "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 746,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "Paiement: ",
                                                    ((_p_paiement = p.paiement) === null || _p_paiement === void 0 ? void 0 : _p_paiement.mode) || "—",
                                                    " • IBAN: ",
                                                    ((_p_paiement1 = p.paiement) === null || _p_paiement1 === void 0 ? void 0 : _p_paiement1.iban) ? "".concat(p.paiement.iban.slice(0, 8), "…") : "—",
                                                    " • BIC: ",
                                                    ((_p_paiement2 = p.paiement) === null || _p_paiement2 === void 0 ? void 0 : _p_paiement2.bic) || "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 747,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500 mt-1",
                                                children: [
                                                    "Contrat: ",
                                                    ((_p_contrat = p.contrat) === null || _p_contrat === void 0 ? void 0 : _p_contrat.statut) || "—",
                                                    " • signé le ",
                                                    ((_p_contrat1 = p.contrat) === null || _p_contrat1 === void 0 ? void 0 : _p_contrat1.date_signature) || "—",
                                                    " • durée ",
                                                    (_p_contrat_duree_mois = (_p_contrat2 = p.contrat) === null || _p_contrat2 === void 0 ? void 0 : _p_contrat2.duree_mois) !== null && _p_contrat_duree_mois !== void 0 ? _p_contrat_duree_mois : "—",
                                                    " mois"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 748,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 743,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500",
                                        children: "—"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 753,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 740,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-2",
                                        children: "📊 Tableau de Bord"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 759,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$partenaires$2f5b$id$5d2f$InvoicesCommissionsCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        partnerId: dossier.partenaireId,
                                        data: pDetails
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 760,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 758,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-2",
                                        children: "📈 Suivi Commercial"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 769,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$partenaires$2f5b$id$5d2f$PartnerTracking$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        partnerId: dossier.partenaireId
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 770,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 768,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "bg-gray-50 rounded p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1",
                                        children: "📁 Espace documentaire"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 775,
                                        columnNumber: 17
                                    }, this),
                                    docs && (docs.contrat_pdf || docs.modalites_collaboration_pdf || (docs.documentation_tech || []).length) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "list-disc pl-5 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "Contrat:",
                                                    " ",
                                                    docs.contrat_pdf ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        className: "underline text-blue-600",
                                                        href: docs.contrat_pdf,
                                                        target: "_blank",
                                                        rel: "noreferrer",
                                                        children: "ouvrir"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                        lineNumber: 781,
                                                        columnNumber: 27
                                                    }, this) : "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 778,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "Modalités:",
                                                    " ",
                                                    docs.modalites_collaboration_pdf ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        className: "underline text-blue-600",
                                                        href: docs.modalites_collaboration_pdf,
                                                        target: "_blank",
                                                        rel: "noreferrer",
                                                        children: "ouvrir"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                        lineNumber: 787,
                                                        columnNumber: 27
                                                    }, this) : "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 784,
                                                columnNumber: 21
                                            }, this),
                                            (docs.documentation_tech || []).map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        d.type || "Doc",
                                                        " — ",
                                                        d.url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            className: "underline text-blue-600",
                                                            href: d.url,
                                                            target: "_blank",
                                                            rel: "noreferrer",
                                                            children: d.url
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                            lineNumber: 791,
                                                            columnNumber: 64
                                                        }, this) : "—"
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                    lineNumber: 791,
                                                    columnNumber: 23
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 777,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500",
                                        children: "—"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 795,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 774,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-1",
                                        children: "📋 Informations détaillées"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 801,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "list-disc pl-5 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "Adresse: ",
                                                    p.adresse || "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 803,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "Coord. facturation: ",
                                                    ((_p_coordonnees_facturation = p.coordonnees_facturation) === null || _p_coordonnees_facturation === void 0 ? void 0 : _p_coordonnees_facturation.societe) || "—",
                                                    " — ",
                                                    ((_p_coordonnees_facturation1 = p.coordonnees_facturation) === null || _p_coordonnees_facturation1 === void 0 ? void 0 : _p_coordonnees_facturation1.email_facturation) || "—",
                                                    " — ",
                                                    ((_p_coordonnees_facturation2 = p.coordonnees_facturation) === null || _p_coordonnees_facturation2 === void 0 ? void 0 : _p_coordonnees_facturation2.adresse) || "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 804,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    "Intégration: ",
                                                    p.integration || "—",
                                                    " • Segment: ",
                                                    p.segment || "—"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 805,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 802,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 800,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 738,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 733,
                columnNumber: 9
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 border-l-2 pl-4",
                children: [
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-500",
                        children: "Chargement…"
                    }, void 0, false, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 816,
                        columnNumber: 23
                    }, this),
                    err && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-red-600",
                        children: [
                            "❌ ",
                            err
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 817,
                        columnNumber: 19
                    }, this),
                    details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "bg-gray-50 rounded p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-2",
                                        children: "👥 Suivi des clients"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 823,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: [
                                                            safe((_details_client = details.client) === null || _details_client === void 0 ? void 0 : _details_client.prenom),
                                                            " ",
                                                            safe((_details_client1 = details.client) === null || _details_client1 === void 0 ? void 0 : _details_client1.nom)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                        lineNumber: 826,
                                                        columnNumber: 21
                                                    }, this),
                                                    " — ",
                                                    safe((_details_client2 = details.client) === null || _details_client2 === void 0 ? void 0 : _details_client2.email),
                                                    ((_details_client3 = details.client) === null || _details_client3 === void 0 ? void 0 : _details_client3.telephone) ? " • ".concat(details.client.telephone) : ""
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 825,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-gray-600",
                                                children: [
                                                    "Dossier #",
                                                    dossier.id,
                                                    " — statut ",
                                                    dossier.statut,
                                                    " — créé ",
                                                    dossier.date_creation,
                                                    " — commission ",
                                                    euro(dossier.commission_partenaire_eur)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                                lineNumber: 829,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 824,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 822,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$DossierTimeline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                dossier: (details.dossiers || []).find((dd)=>dd.id === dossier.id) || dossier
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 836,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-2",
                                        children: "📨 Historique (relances & notifications)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 840,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$CommsHistory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        communications: details.communications || details.historique_echanges || [],
                                        relances: details.relances || [],
                                        notifications: details.notifications || [],
                                        compact: true
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 841,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 839,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$ClientMessaging$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                clientId: dossier.clientId,
                                dossiers: details.dossiers || []
                            }, void 0, false, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 850,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-2",
                                        children: "🆔 Identité & adresses"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 854,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$ClientIdentityCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        client: details.client
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 855,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 853,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-2",
                                        children: "📄 Pièces justificatives"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 860,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$clients$2f5b$id$5d2f$PiecesJustificativesCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        pieces: details.pieces_justificatives || [],
                                        downloads: details.telechargements_disponibles || []
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 861,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 859,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "bg-gray-50 rounded p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold mb-2",
                                        children: "🏢 Mon entreprise"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 869,
                                        columnNumber: 17
                                    }, this),
                                    entrepriseCardLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500",
                                        children: "Chargement…"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 870,
                                        columnNumber: 43
                                    }, this),
                                    entrepriseCardErr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-red-600",
                                        children: [
                                            "❌ ",
                                            entrepriseCardErr
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 871,
                                        columnNumber: 39
                                    }, this),
                                    entrepriseCard ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$crm$292f$crm$2f$entreprises$2f5b$id$5d2f$EntrepriseCard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        data: entrepriseCard
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 873,
                                        columnNumber: 19
                                    }, this) : !entrepriseCardLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-500",
                                        children: "—"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                        lineNumber: 875,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                                lineNumber: 868,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                        lineNumber: 820,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(crm)/crm/dashboard/page.js",
                lineNumber: 815,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(crm)/crm/dashboard/page.js",
        lineNumber: 647,
        columnNumber: 5
    }, this);
}
_s1(DossierRow, "ZGXQF83qRG6/gTEz9B9+YucmZC4=");
_c3 = DossierRow;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "AlertCard");
__turbopack_context__.k.register(_c1, "ActivityCard");
__turbopack_context__.k.register(_c2, "Dashboard");
__turbopack_context__.k.register(_c3, "DossierRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_%28crm%29_crm_7f52756a._.js.map