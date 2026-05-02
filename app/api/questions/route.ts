// app/api/questions/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();
    console.log(formData);
    // 1. Extract Files
    const questionFiles = formData.getAll("questions") as File[];
    const solutionFiles = formData.getAll("solutions") as File[];

    // 2. Upload to Cloudinary and get URLs
    const questionUrls = await Promise.all(
      questionFiles.map((file) => uploadToCloudinary(file, "questions")),
    );

    const solutionUrls = await Promise.all(
      solutionFiles.map((file) => uploadToCloudinary(file, "solutions")),
    );

    // 3. Prepare MongoDB Data
    const questionData = {
      department: formData.get("department"),
      batch: formData.get("batch"),
      session: formData.get("session"),
      courseCode: formData.get("courseCode"),
      courseTitle: formData.get("courseTitle"),
      level: formData.get("level"),
      term: formData.get("term"),
      type: formData.get("type"),
      questionText: formData.get("questionText"),
      uploadedBy: formData.get("uploadedBy"),
      uploaderEmail: formData.get("uploaderEmail"),
      uploaderId: formData.get("uploaderId"),
      questions: questionUrls, // Array of URLs
      solutions: solutionUrls, // Array of URLs
    };

    const newQuestion = await Question.create(questionData);

    return NextResponse.json(
      { success: true, id: newQuestion._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
