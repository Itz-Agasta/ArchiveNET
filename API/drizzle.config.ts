import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

if(!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schemas",
  out: "./src/database/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL
    },
}); 