import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: { type: String, required: true },

    birthdate: { type: String },
    phone: { type: String },

    role: {
      type: String,
      enum: ["admin", "subAdmin", "user"],
      default: "user",
    },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
