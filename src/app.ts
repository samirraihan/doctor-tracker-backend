import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/error.middleware";

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(",").map((item) => item.trim()), credentials: false }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
