import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import analysisRouter from "./routes/analysis.js";
import sessionsRouter from "./routes/sessions.js";
import questionsRouter from "./routes/questions.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/analysis", analysisRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/questions", questionsRouter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Interview Coach API running on http://localhost:${PORT}`);
});

export default app;
