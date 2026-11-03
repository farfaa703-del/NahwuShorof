import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createLesson } from "@/app/admin/actions";
import { LessonEditor } from "@/components/lesson-editor";

export default async function NewLessonPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return <section className="container-page max-w-4xl py-10"><Link href="/admin" className="text-sm font-bold text-forest">← Kembali ke panel admin</Link><h1 className="mt-4 text-3xl font-black text-ink">Tambah materi baru</h1><p className="mb-7 mt-2 text-sm text-[#68766e]">Isi materi dengan penjelasan yang runtut dan contoh Bahasa Arab yang sudah diperiksa.</p><LessonEditor action={createLesson} error={params.error} /></section>;
}
