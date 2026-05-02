// components/question/steps/ClassificationStep.tsx
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FormSelect } from "../upload/form-select";
import { toast } from "sonner";

interface Props {
  form: any;
  updateForm: (key: string, value: string) => void;
  batchOptions: { label: string; value: string }[];
  onNext: () => void;
}

export function ClassificationStep({
  form,
  updateForm,
  batchOptions,
  onNext,
}: Props) {
  const handleNext = () => {
    const missingFields = [];
    if (!form.department) missingFields.push("Department");
    if (!form.batch) missingFields.push("Batch");
    if (!form.session) missingFields.push("Session");

    if (missingFields.length > 0) {
      toast.error("Selection Required", {
        position: "top-right",
        // Highlighted Description
        description: (
          <div className="mt-1.5">
            Please select:{" "}
            <span className="font-black text-[#9f1239] underline decoration-[#fb7185]/30">
              {missingFields.join(", ")}
            </span>
          </div>
        ),
        duration: 5000,
        // Custom Rose Styling
        style: {
          backgroundColor: "#fff1f2",
          color: "#be123c",
          borderRadius: "24px",
          border: "2px solid #fb7185",
          padding: "16px",
        },
        // The Close/Action Button
        action: {
          label: "X",
          onClick: () => console.log("Toast closed"),
        },
        // Styling the action button specifically
        actionButtonStyle: {
          backgroundColor: "#fb7185",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "800",
          fontSize: "12px",
          textTransform: "uppercase",
        },
      });
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h3 className="text-3xl font-black tracking-tighter text-slate-900">
          01. CLASSIFICATION
        </h3>
        <p className="text-sm text-muted-foreground font-medium">
          Identify the target student group.
        </p>
      </div>

      {/* Increased gap and ensured full width items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <FormSelect
          required
          label="Department"
          placeholder="Select Dept"
          options={[
            { label: "CSE", value: "CSE" },
            { label: "EEE", value: "EEE" },
          ]}
          onValueChange={(v: string) => updateForm("department", v)}
          value={form.department}
        />
        <FormSelect
          required
          label="Batch"
          placeholder="Select Batch"
          options={batchOptions}
          onValueChange={(v: string) => updateForm("batch", v)}
          value={form.batch}
        />
        <FormSelect
          required
          label="Session"
          placeholder="Select Session"
          options={[
            { label: "Winter", value: "Winter" },
            { label: "Summer", value: "Summer" },
          ]}
          onValueChange={(v: string) => updateForm("session", v)}
          value={form.session}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          className="h-14 px-10 rounded-2xl text-base font-bold bg-emerald-500 hover:bg-emerald-600 transition-all flex gap-2 shadow-lg hover:shadow-emerald-200"
        >
          Continue <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
