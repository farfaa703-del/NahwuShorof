import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createQuiz } from "@/app/admin/quiz-actions";
import { QuizEditor } from "@/components/quiz-editor";

export default async function NewQuizPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: lessons } = await supabase.from("lessons").select("id,title,subject").order("order_no");
  return <section className="container-page max-w-4xl py-10"><h1 className="text-3xl font-black text-ink">Tambah kuis</h1><p className="mb-7 mt-2 text-sm text-[#68766e]">Pilih materi, tulis pertanyaan, empat opsi jawaban, dan tentukan jawaban benar.</p><QuizEditor action={createQuiz} lessons={lessons ?? []} error={params.error} /></section>;
}
