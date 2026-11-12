import { doctorRepository } from "../repositories/doctor.repository";
import { Patient } from "../models/patient.model";
import { ApiError } from "../utils/api-error";

export const doctorService = {
  list: (query: any) => doctorRepository.list(query),
  async create(data: Record<string, unknown>) {
    return doctorRepository.create(data);
  },
  async get(id: string) {
    const doctor = await doctorRepository.findById(id);
    if (!doctor) throw new ApiError(404, "Doctor not found");
    return doctor;
  },
  async remove(id: string) {
    const doctor = await doctorRepository.findById(id);
    if (!doctor) throw new ApiError(404, "Doctor not found");
    await Patient.deleteMany({ doctor: id });
    await doctorRepository.delete(id);
  }
};
