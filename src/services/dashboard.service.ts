import { Doctor } from "../models/doctor.model";
import { Patient } from "../models/patient.model";

export const dashboardService = {
  async summary() {
    const [doctors, patients, recentPatients, distribution, monthly, specialties] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Patient.find().populate("doctor", "name").sort({ createdAt: -1 }).limit(5).lean(),
      Patient.aggregate([{ $group: { _id: "$doctor", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }, { $lookup: { from: "doctors", localField: "_id", foreignField: "_id", as: "doctor" } }, { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } }, { $project: { doctor: "$doctor.name", count: 1 } }]),
      Patient.aggregate([{ $match: { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1) } } }, { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { "_id.year": 1, "_id.month": 1 } }]),
      Doctor.distinct("specialization").then((s) => s.length)
    ]);
    return { doctors, patients, recentPatients, distribution, monthly, specialties };
  }
};
