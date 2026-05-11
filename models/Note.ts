import mongoose, { Schema } from "mongoose";

const NoteFileSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    dataUrl: { type: String, required: true },
  },
  { _id: false },
);

const NoteSchema = new Schema(
  {
    ownerKey: { type: String, required: true, index: true },
    courseCode: { type: String, required: true },
    topic: { type: String, required: true },
    description: { type: String },
    files: { type: [NoteFileSchema], default: [] },
  },
  { timestamps: true },
);

export const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);