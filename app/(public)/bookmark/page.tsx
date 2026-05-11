"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Download, FileText, ImageIcon, Maximize2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import {
  clearBookmarks,
  getBookmarks,
  getBookmarkOwnerKey,
  removeBookmark,
  type BookmarkGroup,
} from "@/lib/bookmarks";
import { downloadFile } from "@/lib/utils/downloadFile";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkGroup[]>([]);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const ownerKey = getBookmarkOwnerKey(user);

  useEffect(() => {
    let cancelled = false;

    const syncBookmarks = async () => {
      const nextBookmarks = await getBookmarks(ownerKey);
      if (!cancelled) {
        setBookmarks(nextBookmarks);
      }
    };

    void syncBookmarks();
    window.addEventListener("qvault-bookmarks-updated", syncBookmarks);

    return () => {
      cancelled = true;
      window.removeEventListener("qvault-bookmarks-updated", syncBookmarks);
    };
  }, [ownerKey]);

  const refreshBookmarks = async () => setBookmarks(await getBookmarks(ownerKey));

  const handleClearAll = async () => {
    await clearBookmarks(ownerKey);
    await refreshBookmarks();
    toast.success("Bookmarks cleared", {
      position: "top-center",
      className: "bg-red-50 border-2 border-red-200 text-red-900 font-bold text-lg px-5 py-4 shadow-lg shadow-red-100",
    });
  };

  const handleRemove = async (questionId: string) => {
    await removeBookmark(ownerKey, questionId);
    await refreshBookmarks();
    toast.success("Removed bookmark", {
      position: "top-center",
      className: "bg-red-50 border-2 border-red-200 text-red-900 font-bold text-lg px-5 py-4 shadow-lg shadow-red-100",
    });
  };

  const openRemoveDialog = (questionId: string) => {
    setPendingQuestionId(questionId);
    setRemoveDialogOpen(true);
  };

  const getFileName = (questionId: string, index: number, prefix: string) =>
    `${prefix}-${questionId}-${index + 1}`;

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
      <ConfirmationDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        title="Clear all bookmarks?"
        description="This will clear all the bookmarks saved in this account."
        confirmLabel="Clear all"
        onConfirm={handleClearAll}
      />

      <ConfirmationDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove this bookmark?"
        description="This bookmark will be removed from your saved list."
        confirmLabel="Remove"
        onConfirm={() => {
          if (pendingQuestionId) {
            void handleRemove(pendingQuestionId);
          }
          setPendingQuestionId(null);
        }}
      />

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
              onClick={() => setClearDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:border-red-300 hover:text-red-800"
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
              <Card key={group.questionId} className="overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm">
                <div className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Question pages
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {(group.question.questions || []).length > 0 ? (
                          group.question.questions?.map((url, index) => (
                            <div key={url} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm group">
                              <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                                <img src={url} alt={`Question page ${index + 1}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
                                  <Button type="button" variant="secondary" className="h-8 rounded-lg text-xs flex-1" onClick={() => window.open(url, "_blank", "noreferrer")}>
                                    <Maximize2 className="h-3.5 w-3.5" /> View Full
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 rounded-lg text-xs flex-1 border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:text-emerald-800 bg-white"
                                    onClick={() => downloadFile(url, getFileName(group.questionId, index, "question"))}
                                  >
                                    <Download className="h-3.5 w-3.5" /> Download
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2 p-3">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                                  <ImageIcon className="h-3.5 w-3.5" /> Q-P{index + 1}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-slate-500">No question files stored.</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
                        Related solves
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {group.solves.length > 0 ? (
                          group.solves.map((solve, index) => (
                            <div key={solve.url} className="overflow-hidden rounded-2xl border border-cyan-200 bg-cyan-50/60 shadow-sm group">
                              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-cyan-100 to-white p-4 overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                                <div className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                                  {solve.label}
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="h-8 rounded-lg text-xs flex-1 bg-cyan-600 text-white hover:bg-cyan-700"
                                    onClick={() => window.open(solve.url, "_blank", "noreferrer")}
                                  >
                                    <Maximize2 className="h-3.5 w-3.5" /> View Full
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 rounded-lg text-xs flex-1 border-cyan-200 text-cyan-700 hover:border-cyan-300 hover:text-cyan-800 bg-white"
                                    onClick={() => downloadFile(solve.url, getFileName(group.questionId, index, "solve"))}
                                  >
                                    <Download className="h-3.5 w-3.5" /> Download
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2 p-3">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-700">
                                  <FileText className="h-3.5 w-3.5" /> Solve {index + 1}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-slate-500">No solves linked yet.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                    <div className="space-y-4">
                      <div>
                        <div className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          {group.question.department || group.question.dept} • {group.question.batch}
                        </div>
                        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                          {group.question.courseTitle || group.question.courseCode}
                        </h2>
                      </div>

                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                          <span className="font-semibold text-slate-500">Course code</span>
                          <span className="text-right font-bold text-slate-900">{group.question.courseCode || "-"}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                          <span className="font-semibold text-slate-500">Level</span>
                          <span className="text-right font-bold text-slate-900">{group.question.level || "-"}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                          <span className="font-semibold text-slate-500">Term</span>
                          <span className="text-right font-bold text-slate-900">{group.question.term || "-"}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                          <span className="font-semibold text-slate-500">Type</span>
                          <span className="text-right font-bold text-slate-900">{group.question.type || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end pt-6">
                      <Button type="button" variant="destructive" className="rounded-full px-4" onClick={() => openRemoveDialog(group.questionId)}>
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}