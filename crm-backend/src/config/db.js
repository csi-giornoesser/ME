// bien verifier que on a fait npm i pg
//bibliothèque pour que Node comprenne comment 
// se connecter et dialoguer avec la base

// 1) On importe dotenv pour lire le fichier .env
import dotenv from "dotenv";

// 2) On importe la librairie officielle PostgreSQL
import pg from "pg";

// 3) On charge les variables d'environnement (.env)
dotenv.config();

// 4) On récupère la classe Pool de pg
const { Pool } = pg;

/**
 * 🔹 Pourquoi on utilise Pool ?
 * Un Pool = une "piscine" de connexions réutilisables à PostgreSQL.
 * Avantage : plus rapide et plus efficace que d'ouvrir une nouvelle connexion à chaque requête.
 */

// 5) Pour éviter de recréer plusieurs pools pendant le développement (avec nodemon)
//    On crée un singleton : on réutilise toujours la même connexion.
let pool = globalThis.__PG_POOL;

if (!pool) {
  pool = new Pool({
    // On lit l'URL complète de connexion à PostgreSQL depuis le .env
    connectionString: process.env.DATABASE_URL,

    // Obligatoire pour Neon, Render, Railway, etc. → sinon erreur SSL
    ssl: { rejectUnauthorized: false },
  });

  // On sauvegarde le pool dans une variable globale → réutilisable
  globalThis.__PG_POOL = pool;
}

/**
 * 6) On exporte 3 helpers pour le reste du projet :
 */

// a) getPool → récupère le Pool si besoin
export const getPool = () => pool;

// b) query → méthode la plus simple pour exécuter des requêtes SQL
// Exemple : const { rows } = await query("SELECT * FROM clients WHERE id=$1", [id]);
export const query = (text, params) => pool.query(text, params);

// c) withClient → utile pour des séries de requêtes ou transactions
// Exemple :
// await withClient(async (client) => {
//   await client.query("BEGIN");
//   await client.query("INSERT INTO clients(name) VALUES($1)", ["Caroline"]);
//   await client.query("COMMIT");
// });
export async function withClient(fn) {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release(); // on libère le client à la fin
  }
}
//on ajoute un helper pour le health 
export async function assertDbConnection() {
  const { rows } = await query("SELECT now() AS now");
  return rows[0].now;
}
