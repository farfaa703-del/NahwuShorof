import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateLesson } from "@/app/admin/actions";
import { LessonEditor } from "@/components/lesson-editor";
import type { Lesson } from "@/lib/types";

export default async function EditLessonPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data } = await supabase.from("lessons").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lesson = data as Lesson;
  const updateAction = updateLesson.bind(null, id);

  return <section className="container-page max-w-4xl py-10"><Link href="/admin" className="text-sm font-bold text-forest">← Kembali ke panel admin</Link><h1 className="mt-4 text-3xl font-black text-ink">Edit materi</h1><p className="mb-7 mt-2 text-sm text-[#68766e]">Perbarui isi dan status publikasi materi.</p><LessonEditor action={updateAction} lesson={lesson} error={query.error} /></section>;
}
