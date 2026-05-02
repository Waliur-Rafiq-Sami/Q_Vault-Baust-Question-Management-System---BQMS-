// components/question/steps/CourseIntelStep.tsx
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { FormSelect } from "../upload/form-select";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  form: any; // Add the form prop here
  updateForm: (key: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  levelOptions: any[];
  termOptions: any[];
}

export function CourseIntelStep({
  form,
  updateForm,
  onNext,
  onBack,
  levelOptions,
  termOptions,
}: Props) {
  const [showErrors, setShowErrors] = useState(false);

  const handleNext = () => {
    const missingFields = [];
    if (!form.courseCode) missingFields.push("Course Code");
    if (!form.courseTitle) missingFields.push("Course Title");
    if (!form.level) missingFields.push("Level");
    if (!form.term) missingFields.push("Term");
    if (!form.type) missingFields.push("Exam Type");

    if (missingFields.length > 0) {
      setShowErrors(true);
      toast.error("Information Required", {
        position: "top-right",
        description: (
          <div className="mt-1.5">
            Please provide:{" "}
            <span className="font-black text-[#9f1239] underline decoration-[#fb7185]/30">
              {missingFields.join(", ")}
            </span>
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
        action: {
          label: "Close",
          onClick: () => {},
        },
        actionButtonStyle: {
          backgroundColor: "#fb7185",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "800",
        },
      });
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h3 className="text-3xl font-black tracking-tighter">
          02. COURSE INTEL
        </h3>
        <p className="text-muted-foreground font-medium">
          Provide specific metadata for the exam.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2.5">
          <label
            className={cn(
              "text-[11px] font-black uppercase tracking-[0.15em] ml-1 transition-colors",
              showErrors && (!form.courseCode || !form.courseTitle)
                ? "text-rose-600"
                : "text-emerald-600",
            )}
          >
            Course Identity{" "}
            {showErrors && <span className="text-rose-500">*</span>}
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={form.courseCode}
              className={cn(
                "flex h-14 w-full md:w-[140px] rounded-2xl border-2 px-5 font-bold transition-all focus:outline-none",
                showErrors && !form.courseCode
                  ? "border-rose-400 bg-rose-50/30 ring-4 ring-rose-50 animate-shake"
                  : "border-slate-100 focus:border-emerald-500",
              )}
              placeholder="CSE-3101"
              onChange={(e) => updateForm("courseCode", e.target.value)}
            />
            <input
              value={form.courseTitle}
              className={cn(
                "flex h-14 flex-1 rounded-2xl border-2 px-5 font-bold transition-all focus:outline-none",
                showErrors && !form.courseTitle
                  ? "border-rose-400 bg-rose-50/30 ring-4 ring-rose-50 animate-shake"
                  : "border-slate-100 focus:border-emerald-500",
              )}
              placeholder="Database Management Systems"
              onChange={(e) => updateForm("courseTitle", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormSelect
            label="Level"
            placeholder="L"
            value={form.level} // Pass value to select
            options={levelOptions}
            onValueChange={(v: string) => updateForm("level", v)}
          />
          <FormSelect
            label="Term"
            placeholder="T"
            value={form.term} // Pass value to select
            options={termOptions}
            onValueChange={(v: string) => updateForm("term", v)}
          />
          <FormSelect
            label="Type"
            placeholder="Type"
            value={form.type} // Pass value to select
            options={[
              { label: "Class Test 01", value: "CT_1" },
              { label: "Class Test 02", value: "CT_2" },
              { label: "Class Test 03", value: "CT_3" },
              { label: "CT-01 (Lab)", value: "CT_1_LAB" },
              { label: "CT-02 (Lab)", value: "CT_2_LAB" },
              { label: "Midterm Exam", value: "MID" },
              { label: "Midterm (Lab)", value: "MID_LAB" },
              { label: "Final Exam", value: "FINAL" },
              { label: "Final (Lab)", value: "FINAL_LAB" },
              { label: "Backlog / Referral", value: "BACKLOG" },
            ]}
            onValueChange={(v: string) => updateForm("type", v)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="h-14 px-6 rounded-2xl font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all flex gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          className="h-14 px-10 rounded-[1.25rem] bg-[#00BA88] hover:bg-[#00a377] text-white font-black text-base shadow-[0_10px_20px_-5px_rgba(0,186,136,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex gap-3"
        >
          Continue
          <ChevronRight className="w-4 h-4 stroke-[3px]" />
        </Button>
      </div>
    </div>
  );
}
