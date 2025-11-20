// Load environment variables from .env file only in local development
// On Vercel, environment variables are injected automatically
import { config } from "dotenv";

if (process.env.VERCEL !== "1" && process.env.NODE_ENV !== "production") {
  config();
  console.log("✓ Environment variables loaded from .env");
}

export {};
