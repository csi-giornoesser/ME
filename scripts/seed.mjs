import { readFile } from "fs/promises";
import { pool } from "./db.mjs";

function j(x) { return x == null ? null : JSON.stringify(x); }

async function main() {
  const raw = await readFile("./mockData.json", "utf8");
  const data = JSON.parse(raw);
  // en haut du fichier, après parse du JSON
  const clientEntrepriseLinks = []; // [[clientId, entrepriseId], ...]


  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) operateurs
    for (const o of (data.operateurs || [])) {
      const twofa = o.two_fa_enabled ?? o["2fa_enabled"] ?? false;
      await client.query(
        `INSERT INTO core.operateurs (id, nom, email, role, two_fa_enabled)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO UPDATE
         SET nom=EXCLUDED.nom, email=EXCLUDED.email, role=EXCLUDED.role, two_fa_enabled=EXCLUDED.two_fa_enabled`,
        [o.id, o.nom, o.email, o.role, twofa]
      );
    }

    // 2) partenaires (sans les sous-tables pour l’instant)
    for (const p of (data.partenaires || [])) {
      await client.query(
        `INSERT INTO core.partenaires
        (id, nom, adresse, integration, type_facturation, taux_commission, segment,
         referent, contrat, paiement, coordonnees_facturation, docs,
         ca_total, commissions_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO UPDATE
         SET nom=EXCLUDED.nom, adresse=EXCLUDED.adresse, integration=EXCLUDED.integration,
             type_facturation=EXCLUDED.type_facturation, taux_commission=EXCLUDED.taux_commission,
             segment=EXCLUDED.segment, referent=EXCLUDED.referent, contrat=EXCLUDED.contrat,
             paiement=EXCLUDED.paiement, coordonnees_facturation=EXCLUDED.coordonnees_facturation,
             docs=EXCLUDED.docs, ca_total=EXCLUDED.ca_total, commissions_total=EXCLUDED.commissions_total`,
        [
          p.id, p.nom, p.adresse, p.integration, p.type_facturation, p.taux_commission, p.segment,
          j(p.referent), j(p.contrat), j(p.paiement), j(p.coordonnees_facturation), j(p.docs),
          p.ca_total ?? null, p.commissions_total ?? null
        ]
      );
    }

    // 3) clients
    for (const c of (data.clients || [])) {
    // mémorise le lien pour plus tard
    const wantedEntrepriseId = c.entrepriseId ?? c.entreprise_id ?? null;
    if (wantedEntrepriseId) clientEntrepriseLinks.push([c.id, wantedEntrepriseId]);

    await client.query(
        `INSERT INTO core.clients
        (id, prenom, nom, email, telephone, date_naissance, pays_naissance, commune_naissance,
        nationalite, situation_matrimoniale, genre, adresse_personnelle, adresse_fiscale,
        preferences_contact, consentements_rgpd, numero_securite_sociale, titulaire_entreprise,
        entreprise_id, operateur_assigne_id, origine_partenaire_id, portail, date_estimee_finalisation)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
        ON CONFLICT (id) DO UPDATE
        SET prenom=EXCLUDED.prenom, nom=EXCLUDED.nom, email=EXCLUDED.email, telephone=EXCLUDED.telephone,
            date_naissance=EXCLUDED.date_naissance, pays_naissance=EXCLUDED.pays_naissance,
            commune_naissance=EXCLUDED.commune_naissance, nationalite=EXCLUDED.nationalite,
            situation_matrimoniale=EXCLUDED.situation_matrimoniale, genre=EXCLUDED.genre,
            adresse_personnelle=EXCLUDED.adresse_personnelle, adresse_fiscale=EXCLUDED.adresse_fiscale,
            preferences_contact=EXCLUDED.preferences_contact, consentements_rgpd=EXCLUDED.consentements_rgpd,
            numero_securite_sociale=EXCLUDED.numero_securite_sociale, titulaire_entreprise=EXCLUDED.titulaire_entreprise,
            entreprise_id=EXCLUDED.entreprise_id, operateur_assigne_id=EXCLUDED.operateur_assigne_id,
            origine_partenaire_id=EXCLUDED.origine_partenaire_id, portail=EXCLUDED.portail,
            date_estimee_finalisation=EXCLUDED.date_estimee_finalisation`,
        [
        c.id, c.prenom, c.nom, c.email, c.telephone, c.date_naissance ?? null,
        c.pays_naissance ?? null, c.commune_naissance ?? null, c.nationalite ?? null,
        c.situation_matrimoniale ?? null, c.genre ?? null,
        j(c.adresse_personnelle), j(c.adresse_fiscale),
        j(c.preferences_contact), j(c.consentements_rgpd),
        c.numero_securite_sociale ?? null,
        c.titulaireEntreprise ?? c.titulaire_entreprise ?? true,
        null, // 🔴 IMPORTANT: on met NULL ici
        c.operateurAssigneId ?? c.operateur_assigne_id ?? null,
        c.origine_partenaire_id ?? null,
        j(c.portail), c.date_estimee_finalisation ?? null
        ]
    );
    }


    // 4) entreprises
    for (const e of (data.entreprises || [])) {
      await client.query(
        `INSERT INTO core.entreprises
        (id, titulaire_client_id, forme, denomination, statut_dossier,
         coordonnees_pro, activite, lieu_exercice, dates, options_sociales, options_fiscales,
         aides, banque, assurance_pro, conjoint_collaborateur,
         gov_inpi, gov_insee, gov_urssaf, gov_rne, service_paiement, checklist_conformite)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
         ON CONFLICT (id) DO UPDATE
         SET titulaire_client_id=EXCLUDED.titulaire_client_id, forme=EXCLUDED.forme,
             denomination=EXCLUDED.denomination, statut_dossier=EXCLUDED.statut_dossier,
             coordonnees_pro=EXCLUDED.coordonnees_pro, activite=EXCLUDED.activite, lieu_exercice=EXCLUDED.lieu_exercice,
             dates=EXCLUDED.dates, options_sociales=EXCLUDED.options_sociales, options_fiscales=EXCLUDED.options_fiscales,
             aides=EXCLUDED.aides, banque=EXCLUDED.banque, assurance_pro=EXCLUDED.assurance_pro,
             conjoint_collaborateur=EXCLUDED.conjoint_collaborateur,
             gov_inpi=EXCLUDED.gov_inpi, gov_insee=EXCLUDED.gov_insee, gov_urssaf=EXCLUDED.gov_urssaf, gov_rne=EXCLUDED.gov_rne,
             service_paiement=EXCLUDED.service_paiement, checklist_conformite=EXCLUDED.checklist_conformite`,
        [
          e.id, e.titulaireClientId ?? e.titulaire_client_id,
          e.forme ?? "Micro-entrepreneur", e.denomination ?? null, e.statut_dossier,
          j(e.coordonnees_pro), j(e.activite), j(e.lieu_exercice), j(e.dates),
          j(e.options_sociales), j(e.options_fiscales), j(e.aides), j(e.banque),
          j(e.assurance_pro), j(e.conjoint_collaborateur),
          j(e.donnees_gouvernement?.guichet_unique_INPI ?? e.gov_inpi),
          j(e.donnees_gouvernement?.INSEE_SIRENE ?? e.gov_insee),
          j(e.donnees_gouvernement?.URSSAF ?? e.gov_urssaf),
          j(e.donnees_gouvernement?.RNE ?? e.gov_rne),
          j(e.service_paiement), j(e.checklist_conformite)
        ]
      );
    }

    // 4.bis) Lier les clients aux entreprises maintenant que les entreprises existent
    for (const [clientId, entrepriseId] of clientEntrepriseLinks) {
    await client.query(
        `UPDATE core.clients SET entreprise_id = $2 WHERE id = $1`,
        [clientId, entrepriseId]
    );
    }


    // 5) dossiers
    for (const d of (data.dossiers || [])) {
      await client.query(
        `INSERT INTO core.dossiers
        (id, client_id, entreprise_id, partenaire_id, operateur_id, statut,
         date_creation, derniere_modification, date_creation_effective,
         blocages, commission_partenaire_eur, mandat, exportable_csv)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO UPDATE
         SET client_id=EXCLUDED.client_id, entreprise_id=EXCLUDED.entreprise_id, partenaire_id=EXCLUDED.partenaire_id,
             operateur_id=EXCLUDED.operateur_id, statut=EXCLUDED.statut, date_creation=EXCLUDED.date_creation,
             derniere_modification=EXCLUDED.derniere_modification, date_creation_effective=EXCLUDED.date_creation_effective,
             blocages=EXCLUDED.blocages, commission_partenaire_eur=EXCLUDED.commission_partenaire_eur,
             mandat=EXCLUDED.mandat, exportable_csv=EXCLUDED.exportable_csv`,
        [
          d.id, d.clientId, d.entrepriseId, d.partenaireId, d.operateurId, d.statut,
          d.date_creation, d.derniere_modification ?? null, d.date_creation_effective ?? null,
          d.blocages || [], d.commission_partenaire_eur ?? 0, j(d.mandat), d.exportable_csv ?? true
        ]
      );

      // Historique -> core.dossier_events
      for (const ev of (d.historique || [])) {
        await client.query(
          `INSERT INTO core.dossier_events (dossier_id, at, action, meta)
           VALUES ($1, COALESCE($2::timestamptz, now()), $3, $4)`,
          [d.id, ev.date ? `${ev.date}T00:00:00Z` : null, ev.action, j(ev.meta || null)]
        );
      }
    }

    await client.query("COMMIT");
    console.log("✅ Seed terminé (phase 1).");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ Seed FAILED:", e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
