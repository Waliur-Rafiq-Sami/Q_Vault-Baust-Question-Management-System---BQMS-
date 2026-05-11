import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Note } from "@/models/Note";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const ownerKey = searchParams.get("ownerKey");

    if (!ownerKey) {
      return NextResponse.json({ notes: [] }, { status: 200 });
    }

    const notes = await Note.find({ ownerKey }).sort({ updatedAt: -1 });
    return NextResponse.json({ notes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const ownerKey = String(formData.get("ownerKey") || "").trim();
    const courseCode = String(formData.get("courseCode") || "").trim();
    const topic = String(formData.get("topic") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const files = formData.getAll("files") as File[];

    if (!ownerKey || !courseCode || !topic || files.length === 0) {
      return NextResponse.json({ error: "Missing note data" }, { status: 400 });
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        dataUrl: await uploadToCloudinary(file, "notes"),
      })),
    );

    const note = await Note.create({
      ownerKey,
      courseCode,
      topic,
      description,
      files: uploadedFiles,
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save note" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { ownerKey, noteId, clearAll } = body ?? {};

    if (!ownerKey) {
      return NextResponse.json({ error: "Missing owner key" }, { status: 400 });
    }

    if (clearAll) {
      await Note.deleteMany({ ownerKey });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!noteId) {
      return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
    }

    await Note.deleteOne({ ownerKey, _id: noteId });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete note" }, { status: 500 });
  }
}