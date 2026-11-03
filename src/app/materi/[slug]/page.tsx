import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLessonBySlug } from "@/lib/data";
import { ArabicText } from "@/components/arabic-text";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) notFound();

  const supabase = await createClient();
  const { data: quizzes } = await supabase.from("quizzes").select("id,title").eq("lesson_id", lesson.id).eq("published", true);

  return (
    <article className="container-page max-w-4xl py-10">
      <Link href={lesson.subject === "nahwu" ? "/nahwu" : "/sharaf"} className="inline-flex items-center gap-2 text-sm font-bold text-forest"><ArrowLeft size={16} /> Kembali ke daftar materi</Link>
      <div className="mt-7">
        <span className="rounded-full bg-moss px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-forest">{lesson.subject} · {lesson.level}</span>
        <h1 className="mt-4 text-3xl font-black leading-tight text-ink sm:text-4xl">{lesson.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[#65736b]">{lesson.summary}</p>
      </div>
      <div className="surface lesson-content mt-8 p-6 sm:p-9">
        {(lesson.content ?? []).map((block, index) => (
          <section key={index} className="mb-8 last:mb-0">
            {block.heading && <h2 className="mb-3 text-xl font-extrabold text-ink">{block.heading}</h2>}
            {block.arabic && <ArabicText className="my-5 text-3xl text-ink">{block.arabic}</ArabicText>}
            <p>{block.body}</p>
            {block.translation && <p className="mt-2 text-sm italic">{block.translation}</p>}
          </section>
        ))}
      </div>
      {quizzes?.length ? (
        <div className="surface mt-6 flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div><h2 className="font-extrabold text-ink">Uji pemahamanmu</h2><p className="mt-1 text-sm text-[#68766e]">Kerjakan latihan setelah mempelajari materi.</p></div>
          <div className="flex flex-wrap gap-2">{quizzes.map((quiz) => <Link key={quiz.id} href={`/kuis/${quiz.id}`} className="btn-primary"><ClipboardList size={16} /> {quiz.title}</Link>)}</div>
        </div>
      ) : null}
    </article>
  );
}
