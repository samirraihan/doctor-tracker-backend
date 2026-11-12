import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";

export const dashboardController = {
  async summary(_req: Request, res: Response) { res.json({ success: true, data: await dashboardService.summary() }); }
};
