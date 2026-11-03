import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Lesson } from "@/lib/types";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const isNahwu = lesson.subject === "nahwu";
  return (
    <article className="surface group flex h-full flex-col p-5 transition hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${isNahwu ? "bg-[#e8f1e8] text-forest" : "bg-[#f5eddd] text-[#906b2f]"}`}>
          {isNahwu ? "NAHWU" : "SHARAF"}
        </span>
        <BookOpen size={18} className="text-[#8b9b90]" />
      </div>
      <h3 className="text-lg font-extrabold text-ink">{lesson.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[#65736b]">{lesson.summary}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[#efede6] pt-4">
        <span className="text-xs font-semibold text-[#8a958e]">Tingkat {lesson.level}</span>
        <Link href={`/materi/${lesson.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-forest group-hover:gap-2">
          Pelajari <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
