"use client";

import { useEffect, useState } from "react";
import QuestionFilter from "./QuestionFilter";
import QuestionCard from "./QuestionCard";

export default function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    dept: "",
    level: "",
    type: "",
  });

  const fetchData = async () => {
    const query = new URLSearchParams(filters).toString();

    const res = await fetch(`/api/question?${query}`);
    const data = await res.json();

    setQuestions(data);
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="p-6 space-y-6">
      {/* 🔍 Filter */}
      <QuestionFilter filters={filters} setFilters={setFilters} />

      {/* 📄 List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q: any) => (
          <QuestionCard key={q._id} q={q} />
        ))}
      </div>
    </div>
  );
}
