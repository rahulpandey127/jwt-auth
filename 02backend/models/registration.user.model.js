import mongoose from "mongoose";

const registrationUserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // token: String,
  // tokenExp: Date,
  // resetPasswordToken: String,
});

let registration = mongoose.model("Registration", registrationUserSchema);
export default registration;
