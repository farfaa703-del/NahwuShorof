"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CircleHelp, LoaderCircle } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";
import { saveQuizAttempt } from "@/app/kuis/actions";

export function QuizForm({ quizId, questions }: { quizId: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    setError("");
    if (questions.some((_, index) => answers[index] === undefined)) {
      setError("Jawab semua pertanyaan sebelum mengirim jawaban.");
      return;
    }
    startTransition(async () => {
      const response = await saveQuizAttempt(quizId, answers);
      if (!response.ok) {
        setError(response.error);
      } else {
        setResult({ score: response.score, total: response.total });
      }
    });
  }

  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    return (
      <div className="surface p-7 text-center">
        <CheckCircle2 className="mx-auto text-forest" size={46} />
        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-forest">Latihan selesai</p>
        <p className="mt-2 text-5xl font-black text-ink">{percentage}<span className="text-2xl">%</span></p>
        <p className="mt-2 text-[#68766e]">Jawaban benar {result.score} dari {result.total} soal.</p>
        <button className="btn-secondary mt-6" onClick={() => { setAnswers([]); setResult(null); }}>Ulangi latihan</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {questions.map((question, index) => (
        <section key={index} className="surface p-5 sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-moss text-sm font-extrabold text-forest">{index + 1}</span>
            <h2 className="pt-1 font-bold leading-6 text-ink">{question.question}</h2>
          </div>
          <div className="space-y-2 pl-11">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${answers[index] === optionIndex ? "border-forest bg-[#eff6ef] text-ink" : "border-[#ece9e0] hover:bg-[#faf9f4]"}`}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={answers[index] === optionIndex}
                  onChange={() => setAnswers((previous) => {
                    const next = [...previous];
                    next[index] = optionIndex;
                    return next;
                  })}
                  className="accent-[#176b52]"
                />
                {option}
              </label>
            ))}
          </div>
        </section>
      ))}
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button className="btn-primary w-full !py-3 sm:w-auto" onClick={submit} disabled={pending}>
        {pending ? <><LoaderCircle className="animate-spin" size={17} /> Memeriksa jawaban...</> : <><CircleHelp size={17} /> Kirim jawaban</>}
      </button>
      <p className="text-xs text-[#829087]">Nilai dihitung di server berdasarkan kunci jawaban yang tersimpan di database.</p>
    </div>
  );
}
