import { Schema, model } from "mongoose";

const doctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    specialization: { type: String, required: true, trim: true, maxlength: 100 },
    hospital: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 160 }
  },
  { timestamps: true }
);

doctorSchema.index({ name: "text", specialization: "text", hospital: "text" });
doctorSchema.index({ createdAt: -1 });

export const Doctor = model("Doctor", doctorSchema);
