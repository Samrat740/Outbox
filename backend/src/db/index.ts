import { Pool } from "pg";

export const pool = new Pool({
  user: "admin",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "scheduler",
});
