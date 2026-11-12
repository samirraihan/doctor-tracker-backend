import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async login(req: Request, res: Response) { res.json({ success: true, data: await authService.login(req.body.email, req.body.password) }); },
  async me(req: Request, res: Response) { res.json({ success: true, data: await authService.me(req.user!.id) }); }
};
