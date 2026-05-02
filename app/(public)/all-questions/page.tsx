// app/questions/page.tsx
import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ImageIcon } from "lucide-react";

// This makes the page fetch fresh data on every request
export const revalidate = 0;

async function getQuestions() {
  await connectDB();
  // Fetching directly from the database
  const questions = await Question.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(questions)); // Plain objects for RSC
}

export default async function QuestionGallery() {
  const data = await getQuestions();

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
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
          Q-Vault Explorer
        </h1>
        <p className="text-slate-500 font-medium italic">
          Accessing verified academic resources from the repository.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((q: any) => (
          <Card
            key={q._id}
            className="group border-2 border-slate-100 hover:border-emerald-500 transition-all rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl bg-white"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase font-black text-[9px] px-2 py-0.5"
                >
                  {q.department} • {q.batch}
                </Badge>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {q.type}
                </span>
              </div>
              <CardTitle className="text-xl font-black text-slate-800 leading-tight">
                {q.courseTitle}
              </CardTitle>
              <p className="text-xs font-bold text-emerald-600 tracking-wider">
                {q.courseCode}
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex gap-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                <span className="px-2 py-1 bg-slate-50 rounded-md">
                  Level {q.level}
                </span>
                <span className="px-2 py-1 bg-slate-50 rounded-md">
                  Term {q.term}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {/* Question Files */}
                {q.questions.map((url: string, index: number) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-700 rounded-xl transition-all text-[9px] font-black uppercase border border-transparent hover:border-emerald-600"
                  >
                    <ImageIcon className="w-3 h-3" /> Q-P{index + 1}
                  </a>
                ))}

                {/* Solution Files */}
                {q.solutions?.map((url: string, index: number) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-cyan-50 hover:bg-cyan-500 hover:text-white text-cyan-700 rounded-xl transition-all text-[9px] font-black uppercase border border-cyan-100 hover:border-cyan-600"
                  >
                    <FileText className="w-3 h-3" /> Sol-{index + 1}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
