"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Download, ImageIcon, Maximize2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { downloadFile } from "@/lib/utils/downloadFile";
import { clearNotes, getNotes, getNotesOwnerKey, removeNote, type UserNote } from "@/lib/notes";
import { NotesUploadDialog } from "@/components/notes/NotesUploadDialog";

export default function NotesPage() {
  const { user, loading } = useAuth();
  const ownerKey = getNotesOwnerKey(user);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const syncNotes = async () => {
      const nextNotes = await getNotes(ownerKey);
      if (!cancelled) {
        setNotes(nextNotes);
      }
    };

    void syncNotes();
    window.addEventListener("qvault-notes-updated", syncNotes);

    return () => {
      cancelled = true;
      window.removeEventListener("qvault-notes-updated", syncNotes);
    };
  }, [ownerKey]);

  const refreshNotes = async () => setNotes(await getNotes(ownerKey));

  const handleClearAll = async () => {
    await clearNotes(ownerKey);
    await refreshNotes();
    toast.success("Notes cleared", {
      position: "top-center",
      className: "bg-red-50 border-2 border-red-200 text-red-900 font-bold text-lg px-5 py-4 shadow-lg shadow-red-100",
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setPendingNoteId(noteId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingNoteId) {
      const note = notes.find((n) => n.id === pendingNoteId);
      const noteLabel = note ? `${note.courseCode} - ${note.topic}` : "note";
      
      await removeNote(ownerKey, pendingNoteId);
      await refreshNotes();
      toast.success(`Removed ${noteLabel}`, {
        position: "top-center",
        className: "bg-red-50 border-2 border-red-200 text-red-900 font-bold text-lg px-5 py-4 shadow-lg shadow-red-100",
      });
    }
    setPendingNoteId(null);
    setDeleteDialogOpen(false);
  };

  const openDataUrl = (dataUrl: string) => {
    try {
      if (dataUrl.startsWith("data:")) {
        const [meta, b64] = dataUrl.split(',');
        const mime = meta.split(':')[1].split(';')[0] || 'application/octet-stream';
        const binary = atob(b64);
        const len = binary.length;
        const u8 = new Uint8Array(len);
        for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
        const blob = new Blob([u8], { type: mime });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        return;
      }
      window.open(dataUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to open file", err);
      toast.error("Unable to open file");
    }
  };

  const downloadDataUrl = (dataUrl: string, filename?: string) => {
    try {
      if (dataUrl.startsWith("data:")) {
        const [meta, b64] = dataUrl.split(',');
        const mime = meta.split(':')[1].split(';')[0] || 'application/octet-stream';
        const binary = atob(b64);
        const len = binary.length;
        const u8 = new Uint8Array(len);
        for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
        const blob = new Blob([u8], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        return;
      }
      downloadFile(dataUrl, filename || "download");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Download failed", err);
      toast.error("Unable to download file");
    }
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-[2rem] border-2 border-emerald-100 bg-white px-8 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Notes are personal</h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Please log in to upload and view your notes. Each user gets their own notes library.
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
        title="Clear all notes?"
        description="This will remove every note saved in this account."
        confirmLabel="Clear all"
        onConfirm={() => {
          void handleClearAll();
        }}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Remove this note?"
        description="This note will be removed from your saved list."
        confirmLabel="Remove"
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      />

      <NotesUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <FileText className="h-3.5 w-3.5" /> Notes
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tighter text-slate-900">Saved notes library</h1>
            <p className="mt-2 text-slate-500">Upload PDFs or pictures for each topic and keep them tied to your account.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="h-11 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:scale-[1.02] hover:shadow-xl"
            >
              <Upload className="h-4 w-4" /> Upload
            </Button>

            {notes.length > 0 ? (
              <button
                type="button"
                onClick={() => setClearDialogOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 shadow-sm transition hover:border-red-300 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" /> Clear all
              </button>
            ) : null}
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <FileText className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">No notes yet</h2>
              <p className="mt-2 text-sm text-slate-500">Use the upload button to add PDFs or pictures for a course topic.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {notes.map((note) => (
              <Card key={note.id} className="overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm">
                <div className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Note files
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {note.files.length > 0 ? (
                          note.files.map((file) => {
                            const isImage = file.type.startsWith("image/");

                            return (
                              <div key={`${note.id}-${file.name}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                  {isImage ? (
                                    <img src={file.dataUrl} alt={file.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-white p-4 transition-transform duration-300 group-hover:scale-105">
                                      <div className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                                        PDF
                                      </div>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 flex items-end gap-2 bg-black/40 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button type="button" variant="secondary" className="h-8 flex-1 rounded-lg text-xs" onClick={() => openDataUrl(file.dataUrl)}>
                                      <Maximize2 className="h-3.5 w-3.5" /> View Full
                                    </Button>
                                    <Button type="button" variant="outline" className="h-8 flex-1 rounded-lg border-emerald-200 bg-white text-xs text-emerald-700 hover:border-emerald-300 hover:text-emerald-800" onClick={() => downloadDataUrl(file.dataUrl, file.name)}>
                                      <Download className="h-3.5 w-3.5" /> Download
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2 p-3">
                                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                                    {isImage ? <ImageIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                                    {file.name}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-sm text-slate-500">No files stored.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          {note.courseCode}
                        </div>
                        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">{note.topic}</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete this note"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-4">

                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                          <span className="font-semibold text-slate-500">Course code</span>
                          <span className="text-right font-bold text-slate-900">{note.courseCode}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                          <span className="font-semibold text-slate-500">Topic</span>
                          <span className="text-right font-bold text-slate-900">{note.topic}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                          <span className="font-semibold text-slate-500">Description</span>
                          <span className="max-w-[16rem] text-right font-medium text-slate-800">
                            {note.description?.trim() ? note.description : "No description provided"}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
                          <span className="font-semibold text-slate-500">Files</span>
                          <span className="text-right font-bold text-slate-900">{note.files.length}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="font-semibold text-slate-500">Saved</span>
                          <span className="text-right font-bold text-slate-900">{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
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
