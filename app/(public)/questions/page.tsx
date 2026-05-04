import QuestionCard from "@/components/questions/QuestionCard";
import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";

import { FileText } from "lucide-react";

export const revalidate = 0;

async function getQuestions() {
  await connectDB();
  const questions = await Question.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(questions));
}

export default async function QuestionGallery() {
  const data = await getQuestions();
  console.log(data);
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-slate-100 rounded-full">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          No questions found yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Top Section - Ready for Search/Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Q-Vault Explorer
          </h1>
          <p className="text-slate-500 font-medium italic">
            Accessing verified academic resources from the repository.
          </p>
        </div>

        {/* Placeholder for your top bar search/filters */}
        <div className="w-full md:w-auto flex gap-2">
          {/* <SearchBar /> */}
          {/* <FilterDropdown /> */}
        </div>
      </div>

      {/* Grid Layout mapping over the Client Component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((q: any) => (
          <QuestionCard key={q._id} data={q} />
        ))}
      </div>
    </div>
  );
}
