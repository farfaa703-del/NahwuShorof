"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";

type LessonOption = { id: string; title: string; subject: string };
type Props = {
  action: (formData: FormData) => void | Promise<void>;
  lessons: LessonOption[];
  initialTitle?: string;
  initialLessonId?: string;
  initialPublished?: boolean;
  initialQuestions?: QuizQuestion[];
  error?: string;
};

const blankQuestion = (): QuizQuestion => ({
  question: "",
  options: ["", "", "", ""],
  answer: 0,
  explanation: ""
});

export function QuizEditor({
  action, lessons, initialTitle = "", initialLessonId = "", initialPublished = true,
  initialQuestions = [], error
}: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initialQuestions.length ? initialQuestions : [blankQuestion()]
  );

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    setQuestions((current) => current.map((question, i) => i === index ? { ...question, ...patch } : question));
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    setQuestions((current) => current.map((question, i) => {
      if (i !== questionIndex) return question;
      const options = [...question.options];
      options[optionIndex] = value;
      return { ...question, options };
    }));
  }

  return (
    <form action={action} className="space-y-6">
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="surface grid gap-5 p-6 md:grid-cols-2">
        <label className="block text-sm font-bold text-ink md:col-span-2">Judul kuis
          <input name="title" className="field mt-2" required defaultValue={initialTitle} placeholder="Contoh: Kuis Isim, Fi'il, dan Huruf" />
        </label>
        <label className="block text-sm font-bold text-ink">Materi terkait
          <select name="lesson_id" className="field mt-2" required defaultValue={initialLessonId}>
            <option value="" disabled>Pilih materi</option>
            {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>[{lesson.subject}] {lesson.title}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-ink">
          <input type="checkbox" name="published" defaultChecked={initialPublished} className="h-4 w-4 accent-[#176b52]" />
          Publikasikan kuis
        </label>
      </div>

      <input type="hidden" name="questions" value={JSON.stringify(questions)} readOnly />

      {questions.map((question, index) => (
        <section key={index} className="surface space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-extrabold text-ink">Pertanyaan {index + 1}</h2>
            {questions.length > 1 && <button type="button" onClick={() => setQuestions((current) => current.filter((_, i) => i !== index))} className="inline-flex items-center gap-1 text-xs font-bold text-red-600"><Trash2 size={14} /> Hapus</button>}
          </div>
          <label className="block text-sm font-bold text-ink">Teks pertanyaan
            <textarea className="field mt-2 min-h-20" required value={question.question} onChange={(event) => updateQuestion(index, { question: event.target.value })} placeholder="Tulis pertanyaan..." />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="block text-sm font-semibold text-ink">
                Opsi {String.fromCharCode(65 + optionIndex)}
                <input className="field mt-2" required value={option} onChange={(event) => updateOption(index, optionIndex, event.target.value)} placeholder={`Jawaban ${String.fromCharCode(65 + optionIndex)}`} />
              </label>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-bold text-ink">Jawaban benar
              <select className="field mt-2" value={question.answer} onChange={(event) => updateQuestion(index, { answer: Number(event.target.value) })}>
                {question.options.map((_, optionIndex) => <option key={optionIndex} value={optionIndex}>Opsi {String.fromCharCode(65 + optionIndex)}</option>)}
              </select>
            </label>
            <label className="block text-sm font-bold text-ink">Pembahasan (opsional)
              <input className="field mt-2" value={question.explanation ?? ""} onChange={(event) => updateQuestion(index, { explanation: event.target.value })} placeholder="Penjelasan jawaban..." />
            </label>
          </div>
        </section>
      ))}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-secondary" onClick={() => setQuestions((current) => [...current, blankQuestion()])}><Plus size={16} /> Tambah pertanyaan</button>
        <button type="submit" className="btn-primary">Simpan kuis</button>
      </div>
    </form>
  );
}
