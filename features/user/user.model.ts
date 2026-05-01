import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  birthdate: String,
  phone: String,

  role: {
    type: String,
    enum: ["admin", "subAdmin", "user"],
    default: "user",
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
