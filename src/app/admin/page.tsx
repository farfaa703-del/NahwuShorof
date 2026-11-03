import Link from "next/link";
import { redirect } from "next/navigation";
import { BookPlus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteLesson } from "@/app/admin/actions";
import type { Lesson } from "@/lib/types";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data } = await supabase.from("lessons").select("*").order("created_at", { ascending: false });
  const lessons = (data ?? []) as Lesson[];

  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-forest">Pengelolaan konten</p><h1 className="mt-2 text-3xl font-black text-ink">Panel Admin</h1><p className="mt-2 text-sm text-[#68766e]">Kelola materi pembelajaran Nahwu dan Sharaf.</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/admin/quizzes" className="btn-secondary">Kelola kuis</Link><Link href="/admin/lessons/new" className="btn-primary"><BookPlus size={17} /> Tambah materi</Link></div>
      </div>
      {params.success && <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-800">{params.success}</p>}
      {params.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{params.error}</p>}
      <div className="surface mt-8 overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-[#f0f4ed] text-xs uppercase tracking-wider text-[#68766e]"><tr><th className="p-4">Materi</th><th className="p-4">Kategori</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead>
          <tbody>{lessons.map((lesson) => <tr key={lesson.id} className="border-t border-[#efede6]"><td className="p-4"><p className="font-bold text-ink">{lesson.title}</p><p className="mt-1 text-xs text-[#829087]">/{lesson.slug}</p></td><td className="p-4 capitalize">{lesson.subject}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${lesson.published ? "bg-moss text-forest" : "bg-[#f2eee5] text-[#8b744c]"}`}>{lesson.published ? "Terbit" : "Draft"}</span></td><td className="p-4"><div className="flex items-center gap-2"><Link href={`/admin/lessons/${lesson.id}/edit`} className="btn-secondary !rounded-lg !p-2" aria-label="Edit materi"><Pencil size={15} /></Link><form action={deleteLesson.bind(null, lesson.id)}><button className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50" aria-label="Hapus materi"><Trash2 size={15} /></button></form></div></td></tr>)}</tbody>
        </table>
        {!lessons.length && <p className="p-6 text-sm text-[#68766e]">Belum ada materi. Tambahkan materi pertama melalui tombol di atas.</p>}
      </div>
    </section>
  );
}
