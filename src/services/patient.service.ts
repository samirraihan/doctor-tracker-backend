import mongoose from "mongoose";
import { patientRepository } from "../repositories/patient.repository";
import { doctorRepository } from "../repositories/doctor.repository";
import { ApiError } from "../utils/api-error";

export const patientService = {
  list: (query: any) => patientRepository.list(query),
  async create(data: Record<string, unknown>) {
    if (!await doctorRepository.findById(String(data.doctor))) throw new ApiError(404, "Selected doctor not found");
    return patientRepository.create(data);
  },
  async update(id: string, data: Record<string, unknown>) {
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid patient ID");
    if (data.doctor && !await doctorRepository.findById(String(data.doctor))) throw new ApiError(404, "Selected doctor not found");
    const patient = await patientRepository.update(id, data);
    if (!patient) throw new ApiError(404, "Patient not found");
    return patient;
  },
  async remove(id: string) {
    const patient = await patientRepository.delete(id);
    if (!patient) throw new ApiError(404, "Patient not found");
  }
};
