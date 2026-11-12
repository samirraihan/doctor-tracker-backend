import { User } from "../models/user.model";

export const userRepository = {
  findByEmail: (email: string) => User.findOne({ email }).select("+password"),
  findById: (id: string) => User.findById(id),
  create: (data: Record<string, unknown>) => User.create(data)
};
