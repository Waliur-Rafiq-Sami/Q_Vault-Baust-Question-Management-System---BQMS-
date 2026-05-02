"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { AdminCard } from "../upload/admin-card";
import { UploadStepper } from "./UploadStepper";
import { ClassificationStep } from "./ClassificationStep";
import { CourseIntelStep } from "./CourseIntelStep";
import { FinalAssetsStep } from "./FinalAssetsStep";

export default function QuestionUploadForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    department: "",
    batch: "",
    session: "",
    courseCode: "",
    courseTitle: "",
    level: "",
    term: "",
    type: "",
    questionText: "",
  });

  const [questionImages, setQuestionImages] = useState<File[]>([]);
  const [solutionFiles, setSolutionFiles] = useState<File[]>([]);

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFinalSubmit = async () => {
    if (loading) return;
    setLoading(true);

    const formData = new FormData();
    // console.log("dsfsf");
    // 1. Append basic form fields
    Object.keys(form).forEach((key) => {
      const value = form[key as keyof typeof form];
      if (value) formData.append(key, value);
    });

    // 2. Append Uploader Information (Mechanical Requirement)
    if (user) {
      formData.append("uploadedBy", user.name || "Unknown Admin");
      formData.append("uploaderEmail", user.email || "");
      formData.append("uploaderId", user._id || "");
    }

    // 3. Append Multiple Question Images
    questionImages.forEach((file) => {
      formData.append("questions", file);
    });

    // 4. Append Multiple Solution Files (Optional)
    if (solutionFiles.length > 0) {
      solutionFiles.forEach((file) => {
        formData.append("solutions", file);
      });
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Upload Successful");
        // Add success toast or redirect here
      } else {
        const errorData = await response.json();
        console.error(
          "Server Error:",
          errorData.error || "Something went wrong",
        );
      }
    } catch (error) {
      console.error("Server Error:", errorData.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Restricted Zone UI
  if (!user || (user.role !== "admin" && user.role !== "sub-admin")) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="p-8 text-center bg-red-50 border-2 border-red-100 rounded-3xl">
          <h2 className="text-2xl font-black text-red-600 uppercase tracking-tight">
            Access Denied
          </h2>
          <p className="text-red-500 font-medium">
            You must have Admin privileges to deploy content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in duration-700">
      <AdminCard user={user} />

      <div className="py-4">
        <UploadStepper step={step} setStep={setStep} />
      </div>

      <Card className="border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] bg-white/90 backdrop-blur-md overflow-hidden">
        <CardContent className="p-6 md:p-12">
          {step === 1 && (
            <ClassificationStep
              form={form}
              updateForm={updateForm}
              batchOptions={Array.from({ length: 23 }, (_, i) => {
                const batchNum = 23 - i;
                return { label: `Batch ${batchNum}`, value: String(batchNum) };
              })}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <CourseIntelStep
              form={form}
              updateForm={updateForm}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              levelOptions={["1", "2", "3", "4"].map((l) => ({
                label: `Level ${l}`,
                value: l,
              }))}
              termOptions={["1", "2"].map((t) => ({
                label: `Term ${t}`,
                value: t,
              }))}
            />
          )}

          {step === 3 && (
            <FinalAssetsStep
              questionImages={questionImages}
              setQuestionImages={setQuestionImages}
              solutionFiles={solutionFiles}
              setSolutionFiles={setSolutionFiles}
              updateForm={updateForm}
              onBack={() => setStep(2)}
              onSubmit={handleFinalSubmit}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
