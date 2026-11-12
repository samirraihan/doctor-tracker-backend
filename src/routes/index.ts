import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { doctorController } from "../controllers/doctor.controller";
import { patientController } from "../controllers/patient.controller";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, doctorSchema, patientSchema } from "../validators/schemas";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.post("/auth/login", validate(loginSchema), asyncHandler(authController.login));
router.use(authenticate);
router.get("/auth/me", asyncHandler(authController.me));
router.get("/dashboard/summary", asyncHandler(dashboardController.summary));
router.get("/doctors", asyncHandler(doctorController.list));
router.post("/doctors", validate(doctorSchema), asyncHandler(doctorController.create));
router.get("/doctors/:id", asyncHandler(doctorController.get));
router.delete("/doctors/:id", asyncHandler(doctorController.remove));
router.get("/doctors/:id/patients", asyncHandler(doctorController.patients));
router.post("/doctors/:id/patients", validate(patientSchema.omit({ doctor: true })), asyncHandler(doctorController.addPatient));
router.get("/patients", asyncHandler(patientController.list));
router.post("/patients", validate(patientSchema), asyncHandler(patientController.create));
router.patch("/patients/:id", validate(patientSchema.partial()), asyncHandler(patientController.update));
router.delete("/patients/:id", asyncHandler(patientController.remove));

export default router;
