// models/Question.ts
import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  department: String,
  batch: String,
  session: String,
  courseCode: String,
  courseTitle: String,
  level: String,
  term: String,
  type: String,
  questionText: String,
  questions: [String], // Array of Cloudinary URLs
  solutions: [String], // Array of Cloudinary URLs
  uploadedBy: String,
  uploaderEmail: String,
  uploaderId: String,
  createdAt: { type: Date, default: Date.now },
});

export const Question = models.Question || model("Question", QuestionSchema);
