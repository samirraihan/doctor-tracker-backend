import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const doctorSchema = z.object({
  name: z.string().trim().min(2).max(120),
  specialization: z.string().trim().min(2).max(100),
  hospital: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(6).max(30),
  email: z.string().email().max(160)
});
export const patientSchema = z.object({
  name: z.string().trim().min(2).max(120),
  age: z.coerce.number().int().min(0).max(120),
  gender: z.enum(["Male", "Female", "Other"]),
  condition: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  doctor: z.string().min(1),
  notes: z.string().max(1000).optional()
});
