import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookmarkButton from "@/components/bookmark/BookmarkButton";

export const revalidate = 0;

async function getRecent() {
  await connectDB();
  const questions = await Question.find({}).sort({ createdAt: -1 }).limit(12);
  return JSON.parse(JSON.stringify(questions));
}

const page = async () => {
  const data = await getRecent();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-8">
          
          <div className="flex items-center gap-3">
            <a
              href="/questions"
              className="px-4 py-2 text-white bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-full shadow hover:shadow-lg transition">
              Browse all
            </a>
            <span className="text-sm text-slate-500">Newest uploads shown below</span>
          </div>
        </header>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Recent question uploads</h2>

          <div className="relative">
            <div className="overflow-x-auto row-scrollbar pb-2">
              <div className="flex gap-6 py-4 pb-6">
                {data.map((q: any) => (
                  <div key={q._id} className="min-w-[320px]">
                    <Card className="relative overflow-hidden rounded-2xl shadow-sm border-2 border-slate-100 bg-white hover:shadow-xl hover:border-emerald-300 transition-all">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                              {q.department || q.dept} • {q.batch}
                            </div>
                            <CardTitle className="mt-0.5 text-slate-900 text-lg font-bold">{q.courseTitle || q.courseCode}</CardTitle>
                          </div>
                          <div className="text-xs text-slate-400">{q.type}</div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pb-14">
                        <p className="text-sm text-slate-600 font-medium">Level {q.level} • Term {q.term}</p>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {(q.questions || []).slice(0, 3).map((url: string, i: number) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-700 rounded-xl transition text-[11px] font-semibold uppercase border border-transparent hover:border-emerald-600"
                            >
                              Q-{i + 1}
                            </a>
                          ))}
                        </div>
                      </CardContent>

                      <BookmarkButton
                        question={q}
                        className="absolute bottom-3 right-3"
                      />
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Recent Solves</h2>

          <div className="relative">
            <div className="overflow-x-auto row-scrollbar pb-2">
              <div className="flex gap-6 py-4 pb-6">
                {(() => {
                  const solves = data.flatMap((q: any) =>
                    (q.solutions || []).map((solutionUrl: string, idx: number) => ({
                      _id: `${q._id}-sol-${idx}`,
                      parentQuestion: q,
                      courseTitle: q.courseTitle || q.courseCode,
                      department: q.department || q.dept,
                      batch: q.batch,
                      type: q.type,
                      level: q.level,
                      term: q.term,
                      solutionUrl,
                      solutionLabel: `Sol-${idx + 1}`,
                    })),
                  );

                  return solves.length === 0 ? (
                    <div className="text-slate-500">No solves yet.</div>
                  ) : (
                    solves.slice(0, 12).map((s: any) => (
                      <div key={s._id} className="min-w-[280px]">
                        <Card className="relative overflow-hidden rounded-2xl shadow-sm border-2 border-slate-100 bg-white hover:shadow-xl hover:border-emerald-300 transition-all">
                          <CardHeader className="py-3 px-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                  {s.department} • {s.batch}
                                </div>
                                <CardTitle className="mt-0.5 text-slate-900 text-md font-bold">{s.courseTitle}</CardTitle>
                              </div>
                              <div className="text-xs text-slate-400">Solution</div>
                            </div>
                          </CardHeader>

                          <CardContent className="p-4 pb-14">
                            <p className="text-sm text-slate-600 font-medium">Level {s.level} • Term {s.term}</p>
                            <div className="mt-3">
                              <a
                                href={s.solutionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:shadow-lg transition"
                              >
                                View Solution
                              </a>
                            </div>
                          </CardContent>

                          <BookmarkButton
                            question={s.parentQuestion}
                            solve={{ url: s.solutionUrl, label: s.solutionLabel }}
                            className="absolute bottom-3 right-3"
                          />
                        </Card>
                      </div>
                    ))
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
