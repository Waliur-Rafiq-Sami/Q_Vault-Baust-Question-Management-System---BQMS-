"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Maximize2,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Eye,
  User,
  Calendar,
  ExternalLink,
  FileText,
  ImageIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { downloadAllFiles } from "@/lib/utils/downloadFile";
import Image from "next/image";

export default function QuestionCard({ data }: { data: any }) {
  const [showSolutions, setShowSolutions] = useState(false);

  return (
    <div className="flex flex-col bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all group">
      {/* 1. PRIMARY IMAGE SECTION (Top) */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {/* 1. PRIMARY IMAGE SECTION (Top) */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <Image
            src={data?.questions[0]}
            alt="Question Preview"
            fill // This replaces the need for width/height
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optional: Helps performance
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 gap-3">
          {/* Full Screen View Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="rounded-full font-bold gap-2"
              >
                <Maximize2 size={16} /> View Full
              </Button>
            </DialogTrigger>
            <DialogContent className="lg:min-w-3xl h-[99vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{data.courseTitle} - All Pages</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4 w-full">
                {data.questions.map((url: string, i: number) => (
                  <div
                    key={i}
                    className="border rounded-xl overflow-hidden relative"
                  >
                    <img src={url} alt={`Page ${i + 1}`} className="w-full" />
                    <Button
                      className="absolute top-4 right-4"
                      onClick={() => window.open(url, "_blank")}
                    >
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Download All Questions */}
          <Button
            onClick={() =>
              downloadAllFiles(data.questions, `${data.courseCode}-Questions`)
            }
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 font-bold gap-2"
          >
            <Download size={16} /> Download All ({data.questions.length})
          </Button>
        </div>
      </div>

      {/* 2. CORE INFORMATION */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Badge className="bg-slate-900 text-white hover:bg-slate-900 px-3">
            {data.type}
          </Badge>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {data.session} • {data.batch}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
            {data.courseTitle}
          </h2>
          <p className="text-sm font-bold text-emerald-600 uppercase tracking-tighter">
            {data.courseCode} • Level {data.level} Term {data.term}
          </p>
        </div>

        {data.questionText && (
          <p className="text-xs text-slate-500 line-clamp-2 italic">
            "{data.questionText}"
          </p>
        )}

        {/* 3. SOLUTION SECTION (Hidden by default) */}
        <div className="pt-2">
          <Button
            variant="ghost"
            onClick={() => setShowSolutions(!showSolutions)}
            className={`w-full justify-between rounded-xl border-2 transition-all ${
              showSolutions
                ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <span className="flex items-center gap-2 font-black uppercase text-xs">
              <FileCheck size={16} />
              {showSolutions
                ? "Hide Solutions"
                : `View Solutions (${data.solutions?.length || 0})`}
            </span>
            {showSolutions ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>

          {showSolutions && (
            <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2">
              {data.solutions?.length > 0 ? (
                data.solutions.map((url: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border border-cyan-100 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      {url.endsWith(".pdf") ? (
                        <FileText className="text-red-500" size={16} />
                      ) : (
                        <ImageIcon className="text-blue-500" size={16} />
                      )}
                      <span className="text-[11px] font-bold text-slate-600">
                        Solution Part {idx + 1}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => window.open(url, "_blank")}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-emerald-600"
                        onClick={() => window.open(url, "_blank")}
                      >
                        <Download size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[10px] font-bold text-slate-400 py-4 uppercase">
                  No solutions available
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. FOOTER (Author Info) */}
      <div className="mt-auto p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
            {data.uploadedBy?.charAt(0) || "A"}
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-800 leading-none capitalize">
              {data.uploadedBy}
            </p>
            <p className="text-[9px] text-slate-400 font-medium">
              {data.uploaderEmail}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter flex items-center gap-1">
            <Calendar size={10} />{" "}
            {new Date(data.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
