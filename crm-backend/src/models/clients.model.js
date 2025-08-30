import { query } from "../config/db.js";

// Récupérer tous les clients
export const getAllClients = async () => {
  const result = await query("SELECT id, first_name, last_name FROM clients");
  return result.rows;
};
