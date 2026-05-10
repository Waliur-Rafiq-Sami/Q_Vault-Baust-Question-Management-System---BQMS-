"use client";

import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";

import { createNote, getNotesOwnerKey } from "@/lib/notes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDropzone } from "@/components/upload/file-dropzone";
import { useAuth } from "@/context/AuthContext";

type NotesUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NotesUploadDialog({ open, onOpenChange }: NotesUploadDialogProps) {
  const { user } = useAuth();
  const ownerKey = getNotesOwnerKey(user);
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [topic, setTopic] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const resetForm = () => {
    setCourseCode("");
    setTopic("");
    setFiles([]);
    setShowErrors(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handleUpload = async () => {
    if (loading) {
      return;
    }

    const missingFields = [];
    if (!courseCode.trim()) missingFields.push("Course code");
    if (!topic.trim()) missingFields.push("Topic");
    if (files.length === 0) missingFields.push("At least one file");

    if (missingFields.length > 0) {
      setShowErrors(true);
      toast.error("Information required", {
        position: "top-right",
        description: (
          <div className="mt-1.5">
            Please provide: <span className="font-black text-[#9f1239] underline decoration-[#fb7185]/30">{missingFields.join(", ")}</span>
          </div>
        ),
        duration: 5000,
        style: {
          backgroundColor: "#fff1f2",
          color: "#be123c",
          borderRadius: "24px",
          border: "2px solid #fb7185",
          padding: "16px",
        },
      });
      return;
    }

    setLoading(true);

    try {
      const note = await createNote(ownerKey, {
        courseCode,
        topic,
        files,
      });

      if (!note) {
        throw new Error("Unable to save note");
      }

      toast.success("Note uploaded", {
        position: "top-center",
        className:
          "bg-emerald-50 border-2 border-emerald-200 text-emerald-900 font-bold text-lg px-5 py-4 shadow-lg shadow-emerald-100",
      });
      resetForm();
      handleOpenChange(false);
    } catch (error) {
      toast.error("Upload failed", {
        position: "top-center",
        className:
          "bg-red-50 border-2 border-red-200 text-red-900 font-bold text-lg px-5 py-4 shadow-lg shadow-red-100",
        description: error instanceof Error ? error.message : "Something went wrong while saving your note.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-2 border-emerald-100 bg-white p-0 shadow-2xl sm:max-w-4xl flex flex-col">
        <div className="sticky top-0 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 px-6 py-6 md:px-8 z-10">
          <DialogHeader className="space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              <FileText className="h-3.5 w-3.5" /> Notes Upload
            </div>
            <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900">
              Upload notes
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-sm font-medium text-slate-500">
              Add a course code, the topic, and upload PDF or image pages in one step.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-8 px-6 py-8 md:px-8 md:py-10 flex-1">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2.5">
              <label
                className={cn(
                  "ml-1 text-[11px] font-black uppercase tracking-[0.15em] transition-colors",
                  showErrors && !courseCode.trim() ? "text-rose-600" : "text-emerald-600",
                )}
              >
                Course code {showErrors && <span className="text-rose-500">*</span>}
              </label>
              <input
                value={courseCode}
                onChange={(event) => setCourseCode(event.target.value)}
                placeholder="e.g. CSE-3101"
                className={cn(
                  "h-14 w-full rounded-2xl border-2 px-4 text-base font-bold outline-none transition-all",
                  showErrors && !courseCode.trim()
                    ? "border-rose-400 bg-rose-50/30 ring-4 ring-rose-50"
                    : "border-slate-100 focus:border-emerald-500",
                )}
              />
            </div>

            <div className="space-y-2.5">
              <label
                className={cn(
                  "ml-1 text-[11px] font-black uppercase tracking-[0.15em] transition-colors",
                  showErrors && !topic.trim() ? "text-rose-600" : "text-emerald-600",
                )}
              >
                Topic {showErrors && <span className="text-rose-500">*</span>}
              </label>
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="e.g. Database normalization"
                className={cn(
                  "h-14 w-full rounded-2xl border-2 px-4 text-base font-bold outline-none transition-all",
                  showErrors && !topic.trim()
                    ? "border-rose-400 bg-rose-50/30 ring-4 ring-rose-50"
                    : "border-slate-100 focus:border-emerald-500",
                )}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border-2 border-dashed border-emerald-100 bg-emerald-50/30 p-4 md:p-6">
            <FileDropzone
              label="Notes files"
              description="Upload PDFs or images for this topic"
              icon={Upload}
              accept=".pdf,image/*"
              files={files}
              onFilesChange={setFiles}
              preview
              multiple
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="h-14 rounded-[1.25rem] bg-[#00BA88] px-10 text-base font-black text-white shadow-[0_10px_20px_-5px_rgba(0,186,136,0.3)] transition-all hover:bg-[#00a377] hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "UPLOADING..." : "UPLOAD NOTES"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
