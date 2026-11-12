import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(24),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  ADMIN_NAME: z.string().default("System Administrator"),
  ADMIN_EMAIL: z.string().email().default("admin@doctortracker.local"),
  ADMIN_PASSWORD: z.string().min(8).default("ChangeMe123!")
});

export const env = schema.parse(process.env);
