import { handle } from "hono/vercel";
import app from "../dist/index.js";

export const config = {
  runtime: "nodejs",
  maxDuration: 60, // Maximum duration in seconds (adjust based on your Vercel plan)
};

export default handle(app);

