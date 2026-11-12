import { Doctor } from "../models/doctor.model";
import { Patient } from "../models/patient.model";

export const doctorRepository = {
  async list({ page, limit, search, specialization, from, to }: { page: number; limit: number; search: string; specialization?: string; from?: Date; to?: Date }) {
    const filter: Record<string, unknown> = {};
    if (search) filter.$or = ["name", "specialization", "hospital", "email"].map((field) => ({ [field]: { $regex: search, $options: "i" } }));
    if (specialization) filter.specialization = { $regex: specialization, $options: "i" };
    if (from || to) filter.createdAt = { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) };
    const [items, total] = await Promise.all([
      Doctor.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Doctor.countDocuments(filter)
    ]);
    const counts = await Patient.aggregate([{ $match: { doctor: { $in: items.map((item) => item._id) } } }, { $group: { _id: "$doctor", count: { $sum: 1 } } }]);
    const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
    return { items: items.map((item) => ({ ...item, patientCount: countMap.get(String(item._id)) || 0 })), total };
  },
  findById: (id: string) => Doctor.findById(id).lean(),
  create: (data: Record<string, unknown>) => Doctor.create(data),
  delete: (id: string) => Doctor.findByIdAndDelete(id)
};
