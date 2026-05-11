import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Bookmark } from "@/models/Bookmark";

export const runtime = "nodejs";

function uniqueSolves(solves: Array<{ url: string; label: string }>) {
  return solves.filter((solve, index, list) => list.findIndex((item) => item.url === solve.url) === index);
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const ownerKey = searchParams.get("ownerKey");

    if (!ownerKey) {
      return NextResponse.json({ bookmarks: [] }, { status: 200 });
    }

    const bookmarks = await Bookmark.find({ ownerKey }).sort({ updatedAt: -1 });
    return NextResponse.json({ bookmarks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { ownerKey, question, solve } = body ?? {};

    if (!ownerKey || !question?._id) {
      return NextResponse.json({ error: "Missing bookmark data" }, { status: 400 });
    }

    const fallbackSolves = Array.isArray(question.solutions)
      ? question.solutions.map((url: string, index: number) => ({ url, label: `Sol-${index + 1}` }))
      : [];
    const incomingSolves = solve ? [solve] : fallbackSolves;

    const existing = await Bookmark.findOne({ ownerKey, questionId: question._id });

    if (!existing) {
      const created = await Bookmark.create({
        ownerKey,
        questionId: question._id,
        question: {
          ...question,
          questions: question.questions ?? [],
          solutions: question.solutions ?? [],
        },
        solves: uniqueSolves(incomingSolves),
      });

      return NextResponse.json({ bookmark: created }, { status: 201 });
    }

    existing.question = {
      ...question,
      questions: question.questions ?? [],
      solutions: question.solutions ?? [],
    };
    existing.solves = uniqueSolves([...(existing.solves ?? []), ...incomingSolves]);
    existing.updatedAt = new Date();
    await existing.save();

    return NextResponse.json({ bookmark: existing }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save bookmark" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { ownerKey, questionId, clearAll } = body ?? {};

    if (!ownerKey) {
      return NextResponse.json({ error: "Missing owner key" }, { status: 400 });
    }

    if (clearAll) {
      await Bookmark.deleteMany({ ownerKey });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!questionId) {
      return NextResponse.json({ error: "Missing questionId" }, { status: 400 });
    }

    await Bookmark.deleteOne({ ownerKey, questionId });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete bookmark" }, { status: 500 });
  }
}