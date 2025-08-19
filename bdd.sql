-- 0) Préambule
CREATE SCHEMA IF NOT EXISTS tampon;
CREATE SCHEMA IF NOT EXISTS core;
CREATE EXTENSION IF NOT EXISTS citext;

-- ========= TAMPON =========
DROP TABLE IF EXISTS tampon.intake CASCADE;
CREATE TABLE tampon.intake (
  id           BIGSERIAL PRIMARY KEY,
  source       TEXT NOT NULL,
  topic        TEXT NOT NULL,
  payload      JSONB NOT NULL,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS tampon.events CASCADE;
CREATE TABLE tampon.events (
  id          BIGSERIAL PRIMARY KEY,
  job_id      TEXT,
  event_type  TEXT,
  details     JSONB,
  at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========= CORE: A) Opérateurs / Partenaires =========
DROP TABLE IF EXISTS core.operateurs CASCADE;
CREATE TABLE core.operateurs (
  id               INT PRIMARY KEY,
  nom              TEXT NOT NULL,
  email            CITEXT UNIQUE NOT NULL,
  role             TEXT NOT NULL CHECK (role IN ('admin','operator')),
  two_fa_enabled   BOOLEAN NOT NULL DEFAULT FALSE
);

DROP TABLE IF EXISTS core.partenaires CASCADE;
CREATE TABLE core.partenaires (
  id                       INT PRIMARY KEY,
  nom                      TEXT NOT NULL,
  adresse                  TEXT,
  integration              TEXT CHECK (integration IN ('SaaS','API','iframe')),
  type_facturation         TEXT CHECK (type_facturation IN ('directe','indirecte')),
  taux_commission          NUMERIC(6,3),
  segment                  TEXT CHECK (segment IN ('plateforme','banque','assurance','autre')),
  referent                 JSONB,
  contrat                  JSONB,
  paiement                 JSONB,
  coordonnees_facturation  JSONB,
  docs                     JSONB,
  ca_total                 NUMERIC(14,2),
  commissions_total        NUMERIC(14,2),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS core.partner_users CASCADE;
CREATE TABLE core.partner_users (
  id             TEXT PRIMARY KEY,
  partner_id     INT NOT NULL REFERENCES core.partenaires(id) ON DELETE CASCADE,
  email          CITEXT NOT NULL,
  nom            TEXT,
  role           TEXT NOT NULL CHECK (role IN ('partner_user')),
  two_fa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at  TIMESTAMPTZ
);

DROP TABLE IF EXISTS core.partner_period_ca CASCADE;
CREATE TABLE core.partner_period_ca (
  partenaire_id  INT REFERENCES core.partenaires(id) ON DELETE CASCADE,
  periode        TEXT NOT NULL,
  ca             NUMERIC(14,2) NOT NULL,
  dossiers       INT NOT NULL,
  PRIMARY KEY (partenaire_id, periode)
);

DROP TABLE IF EXISTS core.partner_invoices CASCADE;
CREATE TABLE core.partner_invoices (
  id            TEXT PRIMARY KEY,
  partenaire_id INT REFERENCES core.partenaires(id) ON DELETE CASCADE,
  montant       NUMERIC(14,2) NOT NULL,
  date          DATE NOT NULL,
  statut        TEXT,
  periode       TEXT,
  echeance      DATE,
  pdf           TEXT
);

-- ========= CORE: B) Clients & Entreprises =========
DROP TABLE IF EXISTS core.clients CASCADE;
CREATE TABLE core.clients (
  id                        INT PRIMARY KEY,
  prenom                    TEXT NOT NULL,
  nom                       TEXT NOT NULL,
  email                     CITEXT NOT NULL UNIQUE,
  telephone                 TEXT,
  date_naissance            DATE,
  pays_naissance            TEXT,
  commune_naissance         TEXT,
  nationalite               TEXT,
  situation_matrimoniale    TEXT,
  genre                     TEXT CHECK (genre IN ('M','F','X','m','f')),
  adresse_personnelle       JSONB,
  adresse_fiscale           JSONB,
  preferences_contact       JSONB,
  consentements_rgpd        JSONB,
  numero_securite_sociale   TEXT,
  titulaire_entreprise      BOOLEAN,
  entreprise_id             INT,
  operateur_assigne_id      INT REFERENCES core.operateurs(id),
  origine_partenaire_id     INT REFERENCES core.partenaires(id),
  portail                   JSONB,
  date_estimee_finalisation DATE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS core.entreprises CASCADE;
CREATE TABLE core.entreprises (
  id                      INT PRIMARY KEY,
  titulaire_client_id     INT NOT NULL REFERENCES core.clients(id) ON DELETE CASCADE,
  forme                   TEXT DEFAULT 'Micro-entrepreneur',
  denomination            TEXT,
  statut_dossier          TEXT NOT NULL CHECK (statut_dossier IN ('nouveau','en_cours','en_attente','a_corriger','valide','rejete')),
  coordonnees_pro         JSONB,
  activite                JSONB,
  lieu_exercice           JSONB,
  dates                   JSONB,
  options_sociales        JSONB,
  options_fiscales        JSONB,
  aides                   JSONB,
  banque                  JSONB,
  assurance_pro           JSONB,
  conjoint_collaborateur  JSONB,
  gov_inpi                JSONB,
  gov_insee               JSONB,
  gov_urssaf              JSONB,
  gov_rne                 JSONB,
  service_paiement        JSONB,
  checklist_conformite    JSONB,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE core.clients
  DROP CONSTRAINT IF EXISTS clients_entreprise_fk,
  ADD  CONSTRAINT clients_entreprise_fk
  FOREIGN KEY (entreprise_id) REFERENCES core.entreprises(id) ON DELETE SET NULL;

DROP TABLE IF EXISTS core.documents_generes CASCADE;
CREATE TABLE core.documents_generes (
  id             SERIAL PRIMARY KEY,
  entreprise_id  INT NOT NULL REFERENCES core.entreprises(id) ON DELETE CASCADE,
  type           TEXT NOT NULL CHECK (type IN ('P0 Micro-Entrepreneur','Preuve depot INPI','Avis de situation SIRENE','Attestation URSSAF','Extrait RNE','Recapitulatif Donnees','Recu Paiement','Mandat signé')),
  source         TEXT CHECK (source IN ('systeme','inpi','urssaf','rne')),
  fichier        TEXT NOT NULL,
  date           DATE
);
CREATE INDEX IF NOT EXISTS idx_documents_generes_entreprise ON core.documents_generes (entreprise_id);

DROP TABLE IF EXISTS core.client_downloads CASCADE;
CREATE TABLE core.client_downloads (
  id         SERIAL PRIMARY KEY,
  client_id  INT NOT NULL REFERENCES core.clients(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  fichier    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_client_downloads_client ON core.client_downloads (client_id);

-- ========= CORE: C) Dossiers & timeline =========
DROP TABLE IF EXISTS core.dossiers CASCADE;
CREATE TABLE core.dossiers (
  id                         INT PRIMARY KEY,
  client_id                  INT NOT NULL REFERENCES core.clients(id) ON DELETE CASCADE,
  entreprise_id              INT NOT NULL REFERENCES core.entreprises(id) ON DELETE CASCADE,
  partenaire_id              INT NOT NULL REFERENCES core.partenaires(id),
  operateur_id               INT NOT NULL REFERENCES core.operateurs(id),
  statut                     TEXT NOT NULL CHECK (statut IN ('nouveau','en_cours','en_attente','a_corriger','valide','rejete')),
  date_creation              DATE NOT NULL,
  derniere_modification      DATE,
  date_creation_effective    DATE,
  blocages                   TEXT[] DEFAULT '{}',
  commission_partenaire_eur  NUMERIC(12,2) DEFAULT 0,
  mandat                     JSONB,
  exportable_csv             BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_dossiers_partenaire_date ON core.dossiers (partenaire_id, date_creation);
CREATE INDEX IF NOT EXISTS idx_dossiers_statut ON core.dossiers (statut);

DROP TABLE IF EXISTS core.dossier_events CASCADE;
CREATE TABLE core.dossier_events (
  id         SERIAL PRIMARY KEY,
  dossier_id INT NOT NULL REFERENCES core.dossiers(id) ON DELETE CASCADE,
  at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  action     TEXT NOT NULL,
  meta       JSONB
);
CREATE INDEX IF NOT EXISTS idx_dossier_events_dossier_at ON core.dossier_events (dossier_id, at DESC);

-- ========= CORE: D) Pièces / Tickets / Messages =========
DROP TABLE IF EXISTS core.pieces_justificatives CASCADE;
CREATE TABLE core.pieces_justificatives (
  id             SERIAL PRIMARY KEY,
  dossier_id     INT REFERENCES core.dossiers(id) ON DELETE CASCADE,
  client_id      INT REFERENCES core.clients(id) ON DELETE CASCADE,
  type           TEXT NOT NULL CHECK (type IN ('CNI','Passeport','JustifDomicile','RIB','PermisConduire','PhotoIdentite','MandatSigne')),
  fichier        TEXT NOT NULL,
  statut         TEXT NOT NULL CHECK (statut IN ('valide','en_attente','refusee')),
  motif_refus    TEXT,
  uploaded_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_pieces_dossier ON core.pieces_justificatives (dossier_id);
CREATE INDEX IF NOT EXISTS idx_pieces_client ON core.pieces_justificatives (client_id);

DROP TABLE IF EXISTS core.tickets CASCADE;
CREATE TABLE core.tickets (
  id                    INT PRIMARY KEY,
  dossier_id            INT NOT NULL REFERENCES core.dossiers(id) ON DELETE CASCADE,
  statut                TEXT NOT NULL CHECK (statut IN ('Nouveau','En cours','Résolu','Fermé')),
  priorite              TEXT NOT NULL CHECK (priorite IN ('Basse','Moyenne','Haute')),
  assigne_operateur_id  INT REFERENCES core.operateurs(id),
  ouverture             TEXT CHECK (ouverture IN ('auto','manuelle')),
  source                TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tickets_dossier_statut ON core.tickets (dossier_id, statut);

DROP TABLE IF EXISTS core.ticket_events CASCADE;
CREATE TABLE core.ticket_events (
  id          SERIAL PRIMARY KEY,
  ticket_id   INT NOT NULL REFERENCES core.tickets(id) ON DELETE CASCADE,
  at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  message     TEXT NOT NULL,
  attachments JSONB
);
CREATE INDEX IF NOT EXISTS idx_ticket_events_ticket_at ON core.ticket_events (ticket_id, at DESC);

DROP TABLE IF EXISTS core.messages CASCADE;
CREATE TABLE core.messages (
  id          SERIAL PRIMARY KEY,
  dossier_id  INT NOT NULL REFERENCES core.dossiers(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('Client','Opérateur','Système','client','operateur','system')),
  body        TEXT NOT NULL,
  at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_dossier_at ON core.messages (dossier_id, at DESC);

DROP TABLE IF EXISTS core.client_contact_logs CASCADE;
CREATE TABLE core.client_contact_logs (
  id        SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES core.clients(id) ON DELETE CASCADE,
  at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  type      TEXT,
  note      TEXT
);
CREATE INDEX IF NOT EXISTS idx_client_contact_logs_client_at ON core.client_contact_logs (client_id, at DESC);

-- ========= CORE: E) Emails & Notifications =========
DROP TABLE IF EXISTS core.email_templates CASCADE;
CREATE TABLE core.email_templates (
  key       TEXT PRIMARY KEY,
  sujet     TEXT NOT NULL,
  variables TEXT[] NOT NULL
);

DROP TABLE IF EXISTS core.emails_automatiques CASCADE;
CREATE TABLE core.emails_automatiques (
  id         SERIAL PRIMARY KEY,
  type       TEXT NOT NULL,
  envoye_le  TIMESTAMPTZ NOT NULL,
  client_id  INT REFERENCES core.clients(id) ON DELETE CASCADE,
  dossier_id INT REFERENCES core.dossiers(id) ON DELETE CASCADE,
  canal      TEXT CHECK (canal IN ('email','sms'))
);
CREATE INDEX IF NOT EXISTS idx_emails_auto_dossier_date ON core.emails_automatiques (dossier_id, envoye_le DESC);

DROP TABLE IF EXISTS core.notifications_queue CASCADE;
CREATE TABLE core.notifications_queue (
  id            TEXT PRIMARY KEY,
  type          TEXT NOT NULL,
  client_id     INT REFERENCES core.clients(id) ON DELETE CASCADE,
  dossier_id    INT REFERENCES core.dossiers(id) ON DELETE CASCADE,
  canal         TEXT CHECK (canal IN ('email','sms')),
  scheduled_for TIMESTAMPTZ NOT NULL
);

-- ========= CORE: F) Scraping & Webhooks =========
DROP TABLE IF EXISTS core.scraping_jobs CASCADE;
CREATE TABLE core.scraping_jobs (
  id            TEXT PRIMARY KEY,
  entreprise_id INT REFERENCES core.entreprises(id) ON DELETE CASCADE,
  portail       TEXT,
  etat          TEXT CHECK (etat IN ('pending','running','done','failed')),
  last_event    TEXT,
  updated_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_scraping_state ON core.scraping_jobs (etat);

DROP TABLE IF EXISTS core.webhooks_subscriptions CASCADE;
CREATE TABLE core.webhooks_subscriptions (
  id         TEXT PRIMARY KEY,
  partner_id INT NOT NULL REFERENCES core.partenaires(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  events     TEXT[] NOT NULL,
  secret     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS core.webhooks_deliveries CASCADE;
CREATE TABLE core.webhooks_deliveries (
  id              TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES core.webhooks_subscriptions(id) ON DELETE CASCADE,
  event           TEXT NOT NULL,
  resource_id     TEXT NOT NULL,
  status          TEXT CHECK (status IN ('queued','delivered','failed','retrying','pending','failed_permanent')) DEFAULT 'delivered',
  attempts        INT NOT NULL DEFAULT 0,
  last_at         TIMESTAMPTZ,
  last_error      TEXT
);
CREATE INDEX IF NOT EXISTS idx_webhooks_deliveries_sub_at ON core.webhooks_deliveries (subscription_id, last_at DESC);

-- ========= CORE: G) Finance partenaire =========
DROP TABLE IF EXISTS core.partner_exports_history CASCADE;
CREATE TABLE core.partner_exports_history (
  id           TEXT PRIMARY KEY,
  partner_id   INT REFERENCES core.partenaires(id) ON DELETE CASCADE,
  format       TEXT,
  filtres      JSONB,
  generated_at TIMESTAMPTZ,
  file         TEXT
);

DROP TABLE IF EXISTS core.partner_commission_runs CASCADE;
CREATE TABLE core.partner_commission_runs (
  id         TEXT PRIMARY KEY,
  partner_id INT NOT NULL REFERENCES core.partenaires(id) ON DELETE CASCADE,
  periode    TEXT NOT NULL,
  montant    NUMERIC(14,2) NOT NULL,
  statut     TEXT CHECK (statut IN ('calculé','facturé','payé')),
  echeance   DATE,
  invoice_id TEXT
);

-- ========= CORE: H) Sécurité / RGPD / Métriques =========
DROP TABLE IF EXISTS core.auth_logs CASCADE;
CREATE TABLE core.auth_logs (
  id       SERIAL PRIMARY KEY,
  who      TEXT NOT NULL,
  role     TEXT CHECK (role IN ('partner_user','client_user','admin','operator')),
  action   TEXT NOT NULL,
  success  BOOLEAN NOT NULL,
  ip       INET,
  at       TIMESTAMPTZ NOT NULL
);

DROP TABLE IF EXISTS core.audit_logs CASCADE;
CREATE TABLE core.audit_logs (
  id        SERIAL PRIMARY KEY,
  actor     TEXT NOT NULL,
  role      TEXT,
  action    TEXT NOT NULL,
  resource  TEXT NOT NULL,
  field     TEXT,
  old_value TEXT,
  new_value TEXT,
  at        TIMESTAMPTZ NOT NULL
);

DROP TABLE IF EXISTS core.rgpd_requests CASCADE;
CREATE TABLE core.rgpd_requests (
  id            TEXT PRIMARY KEY,
  type          TEXT NOT NULL,
  subject       TEXT NOT NULL,
  status        TEXT CHECK (status IN ('pending','processing','completed','rejected')),
  requested_at  TIMESTAMPTZ NOT NULL,
  file          TEXT
);

DROP TABLE IF EXISTS core.metrics_snapshots CASCADE;
CREATE TABLE core.metrics_snapshots (
  id        SERIAL PRIMARY KEY,
  taken_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload   JSONB NOT NULL
);

-- Index GIN utiles (optionnels)
CREATE INDEX IF NOT EXISTS gin_clients_addr      ON core.clients USING GIN (adresse_personnelle);
CREATE INDEX IF NOT EXISTS gin_entreprises_insee ON core.entreprises USING GIN (gov_insee);









-- Donne un auto-increment à core.tickets.id si ce n'est pas déjà fait
ALTER TABLE core.tickets
  ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
