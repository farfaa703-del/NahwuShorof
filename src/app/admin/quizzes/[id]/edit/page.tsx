import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateQuiz } from "@/app/admin/quiz-actions";
import { QuizEditor } from "@/components/quiz-editor";
import type { QuizQuestion } from "@/lib/types";

export default async function EditQuizPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [{ data: quiz }, { data: lessons }] = await Promise.all([
    supabase.from("quizzes").select("*").eq("id", id).maybeSingle(),
    supabase.from("lessons").select("id,title,subject").order("order_no")
  ]);
  if (!quiz) notFound();
  const action = updateQuiz.bind(null, id);

  return <section className="container-page max-w-4xl py-10"><h1 className="text-3xl font-black text-ink">Edit kuis</h1><p className="mb-7 mt-2 text-sm text-[#68766e]">Perbarui pertanyaan dan kunci jawaban.</p><QuizEditor action={action} lessons={lessons ?? []} initialTitle={quiz.title} initialLessonId={quiz.lesson_id} initialPublished={quiz.published} initialQuestions={quiz.questions as QuizQuestion[]} error={query.error} /></section>;
}
