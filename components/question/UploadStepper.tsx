// components/question/UploadStepper.tsx
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  step: number;
  setStep: (step: number) => void;
}

export function UploadStepper({ step, setStep }: StepperProps) {
  const steps = [
    { id: 1, label: "Classification" },
    { id: 2, label: "Course Intel" },
    { id: 3, label: "Assets" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <div className="relative flex items-center justify-between">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2" />

        {/* Active Progress Track */}
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 transition-all duration-500 ease-in-out -translate-y-1/2"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s) => {
          const isActive = step >= s.id;
          const isCompleted = step > s.id;
          const isCurrent = step === s.id;

          return (
            <div
              key={s.id}
              className="relative z-10 flex flex-col items-center"
            >
              <button
                onClick={() => setStep(s.id)}
                disabled={s.id > step && !isCompleted} // Only allow clicking back or current
                className={cn(
                  "group flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : isCurrent
                      ? "bg-white border-emerald-500 ring-4 ring-emerald-50"
                      : "bg-white border-slate-200 hover:border-slate-300",
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white stroke-[3px]" />
                ) : (
                  <span
                    className={cn(
                      "text-xs font-black transition-colors",
                      isCurrent
                        ? "text-emerald-600"
                        : "text-slate-400 group-hover:text-slate-600",
                    )}
                  >
                    {s.id}
                  </span>
                )}
              </button>

              {/* Minimalist Label */}
              <span
                className={cn(
                  "absolute -bottom-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  isCurrent
                    ? "text-slate-900 translate-y-0 opacity-100"
                    : "text-slate-400 opacity-0 translate-y-1",
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
