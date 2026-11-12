import { Request, Response } from "express";
import mongoose from "mongoose";
import { doctorService } from "../services/doctor.service";
import { patientService } from "../services/patient.service";
import { ApiError } from "../utils/api-error";

const pagination = (query: Request["query"]) => ({
  page: Math.max(1, Number(query.page) || 1),
  limit: Math.min(50, Math.max(1, Number(query.limit) || 10)),
  search: String(query.search || ""),
  specialization: query.specialization ? String(query.specialization) : undefined,
  from: query.from ? new Date(String(query.from)) : undefined,
  to: query.to ? new Date(String(query.to) + "T23:59:59.999Z") : undefined
});

export const doctorController = {
  async list(req: Request, res: Response) {
    const p = pagination(req.query);
    const result = await doctorService.list(p);
    res.json({
      success: true,
      data: result.items,
      meta: {
        page: p.page,
        limit: p.limit,
        total: result.total,
        pages: Math.ceil(result.total / p.limit)
      }
    });
  },
  async create(req: Request, res: Response) {
    res.status(201).json({ success: true, data: await doctorService.create(req.body), message: "Doctor created" });
  },
  async get(req: Request, res: Response) {
    const id = String(req.params.id);
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid doctor ID");
    res.json({ success: true, data: await doctorService.get(id) });
  },
  async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    await doctorService.remove(id);
    res.json({ success: true, message: "Doctor and associated patients deleted" });
  },
  async patients(req: Request, res: Response) {
    const id = String(req.params.id);
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid doctor ID");
    await doctorService.get(id);
    const p = pagination(req.query);
    const result = await patientService.list({ ...p, doctor: id, condition: "" });
    res.json({
      success: true,
      data: result.items,
      meta: {
        page: p.page,
        limit: p.limit,
        total: result.total,
        pages: Math.ceil(result.total / p.limit)
      }
    });
  },
  async addPatient(req: Request, res: Response) {
    const id = String(req.params.id);
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid doctor ID");
    res.status(201).json({
      success: true,
      data: await patientService.create({ ...req.body, doctor: id }),
      message: "Patient added"
    });
  }
};
