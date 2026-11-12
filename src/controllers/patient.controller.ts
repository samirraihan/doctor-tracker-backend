import { Request, Response } from "express";
import { patientService } from "../services/patient.service";

const query = (req: Request) => ({
  page: Math.max(1, Number(req.query.page) || 1),
  limit: Math.min(50, Math.max(1, Number(req.query.limit) || 10)),
  search: String(req.query.search || ""),
  condition: String(req.query.condition || ""),
  doctor: req.query.doctor ? String(req.query.doctor) : undefined,
  from: req.query.from ? new Date(String(req.query.from)) : undefined,
  to: req.query.to ? new Date(String(req.query.to) + "T23:59:59.999Z") : undefined
});

export const patientController = {
  async list(req: Request, res: Response) {
    const q = query(req);
    const result = await patientService.list(q);
    res.json({
      success: true,
      data: result.items,
      meta: {
        page: q.page,
        limit: q.limit,
        total: result.total,
        pages: Math.ceil(result.total / q.limit)
      }
    });
  },
  async create(req: Request, res: Response) {
    res.status(201).json({ success: true, data: await patientService.create(req.body), message: "Patient created" });
  },
  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    res.json({ success: true, data: await patientService.update(id, req.body), message: "Patient updated" });
  },
  async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    await patientService.remove(id);
    res.json({ success: true, message: "Patient deleted" });
  }
};
