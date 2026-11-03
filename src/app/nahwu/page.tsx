import type { Metadata } from "next";
import { getPublishedLessons } from "@/lib/data";
import { LessonCard } from "@/components/lesson-card";

export const metadata: Metadata = { title: "Materi Nahwu" };

export default async function NahwuPage() {
  const lessons = await getPublishedLessons("nahwu");
  return (
    <section className="container-page py-12">
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-forest">Kurikulum dasar</p>
      <h1 className="mt-2 text-4xl font-black text-ink">Belajar Ilmu Nahwu</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#68766e]">Pelajari aturan yang menjelaskan kedudukan kata dan hubungan antarkata dalam kalimat Bahasa Arab.</p>
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {lessons.length ? lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />) : <div className="surface p-7 text-sm text-[#68766e]">Belum ada materi Nahwu yang dipublikasikan.</div>}
      </div>
    </section>
  );
}
