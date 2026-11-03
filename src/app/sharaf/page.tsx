import type { Metadata } from "next";
import { getPublishedLessons } from "@/lib/data";
import { LessonCard } from "@/components/lesson-card";

export const metadata: Metadata = { title: "Materi Sharaf" };

export default async function SharafPage() {
  const lessons = await getPublishedLessons("sharaf");
  return (
    <section className="container-page py-12">
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#a17b3e]">Kurikulum dasar</p>
      <h1 className="mt-2 text-4xl font-black text-ink">Belajar Ilmu Sharaf</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#68766e]">Pelajari perubahan bentuk kata, pola wazan, dan pembentukan kata kerja maupun kata benda dalam Bahasa Arab.</p>
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {lessons.length ? lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />) : <div className="surface p-7 text-sm text-[#68766e]">Belum ada materi Sharaf yang dipublikasikan.</div>}
      </div>
    </section>
  );
}
