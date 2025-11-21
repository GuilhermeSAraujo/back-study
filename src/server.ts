// Load environment variables first for local development
import "./env.js";

// Start the local development server
import { serve } from "@hono/node-server";
import app from "./index.js";

const port = Number(process.env["PORT"]) || 3001;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`);
  }
);
