import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { QuizForm } from "@/components/quiz-form";
import type { QuizQuestion } from "@/lib/types";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: quiz } = await supabase.from("quizzes").select("id,title,questions").eq("id", id).eq("published", true).maybeSingle();
  if (!quiz) notFound();

  return (
    <section className="container-page max-w-3xl py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest"><ArrowLeft size={16} /> Kembali</Link>
      <p className="mt-7 text-xs font-extrabold uppercase tracking-[.18em] text-forest">Latihan interaktif</p>
      <h1 className="mt-2 text-3xl font-black text-ink">{quiz.title}</h1>
      <p className="mt-3 text-sm leading-6 text-[#68766e]">Pilih satu jawaban yang paling tepat untuk setiap pertanyaan. Sistem akan menghitung nilai setelah jawaban dikirim.</p>
      <div className="mt-8">
        <QuizForm quizId={quiz.id} questions={quiz.questions as QuizQuestion[]} />
      </div>
    </section>
  );
}
