import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { aiRouter } from "./routes/ai";

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  /^https:\/\/[\w-]+\.vercel\.app$/,
];
app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server (no origin) or matching origins
      if (!origin || allowedOrigins.some((r) => r.test(origin))) return cb(null, true);
      cb(new Error(`CORS: origin not allowed — ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Clerk auth middleware — parses the Bearer token on every request
// and attaches auth state to req.auth
app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  })
);

// ── Routes ──────────────────────────────────────────────────
app.use("/api/ai", aiRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
  });
}

// ── Global error handler ─────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[unhandled]", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
