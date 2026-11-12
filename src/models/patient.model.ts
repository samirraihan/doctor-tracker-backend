import { Schema, model } from "mongoose";

const patientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    condition: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160, default: "" },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    notes: { type: String, trim: true, maxlength: 1000, default: "" }
  },
  { timestamps: true }
);

patientSchema.index({ name: "text", condition: "text", phone: "text" });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ doctor: 1, createdAt: -1 });

export const Patient = model("Patient", patientSchema);
