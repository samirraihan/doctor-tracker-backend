import { Patient } from "../models/patient.model";

export const patientRepository = {
  async list({ page, limit, search, condition, doctor, from, to }: { page: number; limit: number; search: string; condition: string; doctor?: string; from?: Date; to?: Date }) {
    const filter: Record<string, unknown> = {};
    if (search) filter.$or = ["name", "condition", "phone", "email"].map((field) => ({ [field]: { $regex: search, $options: "i" } }));
    if (condition) filter.condition = { $regex: condition, $options: "i" };
    if (doctor) filter.doctor = doctor;
    if (from || to) filter.createdAt = { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) };
    const [items, total] = await Promise.all([
      Patient.find(filter).populate("doctor", "name specialization").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Patient.countDocuments(filter)
    ]);
    return { items, total };
  },
  findById: (id: string) => Patient.findById(id).populate("doctor", "name specialization"),
  create: (data: Record<string, unknown>) => Patient.create(data),
  update: (id: string, data: Record<string, unknown>) => Patient.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("doctor", "name specialization"),
  delete: (id: string) => Patient.findByIdAndDelete(id)
};
