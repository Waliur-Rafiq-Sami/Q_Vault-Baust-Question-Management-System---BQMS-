import mongoose, { Schema } from "mongoose";

const BookmarkSolveSchema = new Schema(
  {
    url: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false },
);

const BookmarkQuestionSchema = new Schema(
  {
    _id: { type: String, required: true },
    department: String,
    dept: String,
    batch: String,
    courseCode: String,
    courseTitle: String,
    level: String,
    term: String,
    type: String,
    questions: [String],
    solutions: [String],
  },
  { _id: false },
);

const BookmarkSchema = new Schema(
  {
    ownerKey: { type: String, required: true, index: true },
    questionId: { type: String, required: true },
    question: { type: BookmarkQuestionSchema, required: true },
    solves: { type: [BookmarkSolveSchema], default: [] },
  },
  { timestamps: true },
);

BookmarkSchema.index({ ownerKey: 1, questionId: 1 }, { unique: true });

export const Bookmark = mongoose.models.Bookmark || mongoose.model("Bookmark", BookmarkSchema);