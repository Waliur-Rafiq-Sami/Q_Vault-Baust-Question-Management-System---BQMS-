"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, ImageIcon, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearBookmarks,
  getBookmarks,
  getBookmarkOwnerKey,
  removeBookmark,
  type BookmarkGroup,
} from "@/lib/bookmarks";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkGroup[]>([]);
  const { user, loading } = useAuth();
  const ownerKey = getBookmarkOwnerKey(user);

  useEffect(() => {
    const syncBookmarks = () => setBookmarks(getBookmarks(ownerKey));

    setBookmarks(getBookmarks(ownerKey));
    window.addEventListener("qvault-bookmarks-updated", syncBookmarks);
    window.addEventListener("storage", syncBookmarks);

    return () => {
      window.removeEventListener("qvault-bookmarks-updated", syncBookmarks);
      window.removeEventListener("storage", syncBookmarks);
    };
  }, [ownerKey]);

  const handleClearAll = () => {
    clearBookmarks(ownerKey);
    setBookmarks(getBookmarks(ownerKey));
    toast.success("Bookmarks cleared");
  };

  const handleRemove = (questionId: string) => {
    removeBookmark(ownerKey, questionId);
    setBookmarks(getBookmarks(ownerKey));
    toast.success("Removed bookmark");
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="rounded-[2rem] border-2 border-emerald-100 bg-white px-8 py-14 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Bookmark className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Bookmarks are personal</h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Please log in to save and view your question bookmarks. Each user gets their own bookmark list.
            </p>
            <Link
              href="/auth"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-200 transition hover:scale-[1.02] hover:shadow-xl"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <Bookmark className="h-3.5 w-3.5" /> Bookmarks
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tighter text-slate-900">Saved question sets</h1>
            <p className="mt-2 text-slate-500">Each bookmark keeps the related question and solve together.</p>
          </div>

          {bookmarks.length > 0 ? (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </button>
          ) : null}
        </div>

        {bookmarks.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Bookmark className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">No bookmarks yet</h2>
              <p className="mt-2 text-sm text-slate-500">Use the bookmark button on any question or solve tile.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarks.map((group) => (
              <Card
                key={group.questionId}
                className="relative overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {group.question.department || group.question.dept} • {group.question.batch}
                      </div>
                      <CardTitle className="mt-3 text-2xl font-black text-slate-900">
                        {group.question.courseTitle || group.question.courseCode}
                      </CardTitle>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {group.question.courseCode} • Level {group.question.level} • Term {group.question.term}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(group.questionId)}
                      className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pb-10">
                  <div>
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Question files</h3>
                    <div className="flex flex-wrap gap-2">
                      {(group.question.questions || []).length > 0 ? (
                        group.question.questions?.map((url, index) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <ImageIcon className="h-3.5 w-3.5" /> Q-P{index + 1}
                          </a>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">No question files stored.</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Related solves</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.solves.length > 0 ? (
                        group.solves.map((solve) => (
                          <a
                            key={solve.url}
                            href={solve.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-500 hover:text-white"
                          >
                            <FileText className="h-3.5 w-3.5" /> {solve.label}
                          </a>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500">No solves linked yet.</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}