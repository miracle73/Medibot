import { sql } from "@vercel/postgres";

export const db = {
  query: sql,
};

export type { SQLDatabase } from "@vercel/postgres";