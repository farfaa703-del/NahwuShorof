import Link from "next/link";
import { redirect } from "next/navigation";
import { BookPlus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteQuiz } from "@/app/admin/quiz-actions";

export default async function AdminQuizzesPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [{ data: quizzes }, { data: lessons }] = await Promise.all([
    supabase.from("quizzes").select("id,title,lesson_id,published").order("created_at", { ascending: false }),
    supabase.from("lessons").select("id,title")
  ]);
  const lessonMap = new Map((lessons ?? []).map((lesson) => [lesson.id, lesson.title] as const));

  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-forest">Bank soal</p><h1 className="mt-2 text-3xl font-black text-ink">Kelola kuis</h1><p className="mt-2 text-sm text-[#68766e]">Buat dan perbarui latihan pilihan ganda untuk setiap materi.</p></div>
        <Link href="/admin/quizzes/new" className="btn-primary"><BookPlus size={17} /> Tambah kuis</Link>
      </div>
      {params.success && <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-800">{params.success}</p>}
      {params.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{params.error}</p>}
      <div className="surface mt-8 overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-[#f0f4ed] text-xs uppercase tracking-wider text-[#68766e]"><tr><th className="p-4">Kuis</th><th className="p-4">Materi</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead>
          <tbody>{(quizzes ?? []).map((quiz) => <tr key={quiz.id} className="border-t border-[#efede6]"><td className="p-4 font-bold text-ink">{quiz.title}</td><td className="p-4">{lessonMap.get(quiz.lesson_id) ?? "Materi tidak ditemukan"}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${quiz.published ? "bg-moss text-forest" : "bg-[#f2eee5] text-[#8b744c]"}`}>{quiz.published ? "Terbit" : "Draft"}</span></td><td className="p-4"><div className="flex items-center gap-2"><Link href={`/admin/quizzes/${quiz.id}/edit`} className="btn-secondary !rounded-lg !p-2" aria-label="Edit kuis"><Pencil size={15} /></Link><form action={deleteQuiz.bind(null, quiz.id)}><button className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50" aria-label="Hapus kuis"><Trash2 size={15} /></button></form></div></td></tr>)}</tbody>
        </table>
        {!quizzes?.length && <p className="p-6 text-sm text-[#68766e]">Belum ada kuis. Tambahkan kuis pertama.</p>}
      </div>
      <Link href="/admin" className="mt-6 inline-block text-sm font-bold text-forest">← Kembali ke panel admin</Link>
    </section>
  );
}
