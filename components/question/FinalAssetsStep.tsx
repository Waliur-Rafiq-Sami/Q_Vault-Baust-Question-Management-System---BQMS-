// components/question/steps/FinalAssetsStep.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  SendHorizontal,
  ImageIcon,
  FileText,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { FileDropzone } from "../upload/file-dropzone";
import { toast } from "sonner";

export function FinalAssetsStep({
  questionImages,
  setQuestionImages,
  solutionFiles,
  setSolutionFiles,
  updateForm,
  onBack,
  onSubmit,
  loading,
}: any) {
  const [showSolutions, setShowSolutions] = useState(solutionFiles.length > 0);

  const handleFinalCheck = () => {
    if (questionImages.length === 0) {
      toast.error("Questions required", {
        description: "Please upload at least one image of the question.",
      });
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-10 animate-in zoom-in-95 duration-500">
      <div className="space-y-1 text-center">
        <h3 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
          03. FINAL ASSETS
        </h3>
        <p className="text-sm text-muted-foreground font-medium">
          Verify your files before deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Question Images - ALWAYS VISIBLE & REQUIRED */}
        <FileDropzone
          label="Question Pages"
          description="High-quality images of the question paper"
          icon={ImageIcon}
          accept="image/*"
          files={questionImages}
          onFilesChange={setQuestionImages}
          preview
          multiple
          required
        />

        {/* Dynamic Solution Toggle */}
        {!showSolutions ? (
          <button
            onClick={() => setShowSolutions(true)}
            className="flex items-center justify-center gap-2 py-6 border-2 border-dashed border-slate-200 rounded-3xl text-slate-500 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all font-bold text-sm uppercase tracking-widest"
          >
            <PlusCircle className="w-5 h-5" /> I have a verified solution to add
          </button>
        ) : (
          <div className="space-y-4 p-6 bg-cyan-50/20 border-2 border-cyan-100 rounded-[2.5rem] relative animate-in slide-in-from-top-4">
            <button
              onClick={() => {
                setShowSolutions(false);
                setSolutionFiles([]);
              }}
              className="absolute -top-3 -right-3 p-2 bg-white border-2 border-red-100 text-red-500 rounded-full hover:bg-red-50 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <FileDropzone
              label="Verified Solutions"
              description="Upload PDF or clear images of the answers"
              icon={FileText}
              accept=".pdf,image/*"
              files={solutionFiles}
              onFilesChange={setSolutionFiles}
              colorScheme="cyan"
              multiple
              optional
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">
          Additional Remarks
        </label>
        <Textarea
          placeholder="e.g. 'Page 3 is slightly blurry but readable'..."
          className="min-h-[100px] rounded-2xl border-2 p-4 focus:border-emerald-500 focus:ring-0 transition-all bg-white"
          onChange={(e) => updateForm("questionText", e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={loading}
          className="h-14 px-6 rounded-2xl font-bold text-slate-500"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button
          onClick={handleFinalCheck}
          disabled={loading}
          className="h-14 px-10 rounded-2xl text-base font-black bg-[#00BA88] hover:bg-[#00a377] text-white shadow-lg transition-all gap-2"
        >
          {loading ? "UPLOADING..." : "DEPLOY CONTENT"}{" "}
          <SendHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
