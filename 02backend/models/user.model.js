import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String,
  },
});

export default mongoose.model("User", userSchema);
