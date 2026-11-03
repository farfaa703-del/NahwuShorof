import Link from "next/link";
import { ArrowRight, BookOpenCheck, Brain, Languages, Sparkles } from "lucide-react";
import { getPublishedLessons } from "@/lib/data";
import { LessonCard } from "@/components/lesson-card";

export default async function HomePage() {
  const lessons = await getPublishedLessons();
  const featured = lessons.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#e4eee3] blur-3xl" />
        <div className="container-page relative grid gap-10 py-16 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce7dc] bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-forest"><Sparkles size={14} /> Belajar Bahasa Arab dari Dasar</span>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-6xl">Pahami Nahwu dan Sharaf, <span className="text-forest">langkah demi langkah.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#66766d]">Pelajari kaidah Bahasa Arab melalui materi terstruktur, contoh berharakat, tabel tashrif, dan latihan yang membantu mengukur pemahaman.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/nahwu" className="btn-primary">Mulai belajar <ArrowRight size={17} /></Link>
              <Link href="/register" className="btn-secondary">Buat akun gratis</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-6 text-sm text-[#718078]">
              <span className="flex items-center gap-2"><BookOpenCheck size={17} className="text-forest" /> Materi bertahap</span>
              <span className="flex items-center gap-2"><Brain size={17} className="text-forest" /> Latihan interaktif</span>
              <span className="flex items-center gap-2"><Languages size={17} className="text-forest" /> Contoh Bahasa Arab</span>
            </div>
          </div>
          <div className="surface relative overflow-hidden bg-[#f1f5ed] p-7 sm:p-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[25px] border-white/50" />
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-forest">Kaidah Bahasa Arab</p>
            <div dir="rtl" lang="ar" className="arabic mt-8 text-center text-5xl font-bold text-ink sm:text-6xl">النَّحْوُ وَالصَّرْفُ</div>
            <p className="mt-5 text-center text-sm text-[#6b7a70]">Memahami susunan kalimat dan perubahan bentuk kata.</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold text-[#829087]">ILMU NAHWU</p><p className="mt-2 text-xl font-black text-ink">النَّحْوُ</p><p className="mt-1 text-xs text-[#68766e]">Struktur kalimat</p></div>
              <div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold text-[#829087]">ILMU SHARAF</p><p className="mt-2 text-xl font-black text-ink">الصَّرْفُ</p><p className="mt-1 text-xs text-[#68766e]">Perubahan kata</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-forest">Jalur pembelajaran</p><h2 className="mt-2 text-3xl font-black text-ink">Mulai dari fondasi</h2></div>
          <Link href="/nahwu" className="text-sm font-bold text-forest">Lihat semua materi <ArrowRight className="inline" size={15} /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/nahwu" className="surface group p-6 transition hover:-translate-y-1">
            <span className="text-xs font-extrabold tracking-widest text-forest">01 / NAHWU</span>
            <h3 className="mt-3 text-2xl font-black text-ink">Memahami susunan kalimat</h3>
            <p className="mt-2 max-w-md text-sm leading-7 text-[#68766e]">Kenali jenis kata, i&apos;rab, kedudukan kata, dan pola kalimat Bahasa Arab.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-forest">Jelajahi Nahwu <ArrowRight size={16} /></span>
          </Link>
          <Link href="/sharaf" className="surface group p-6 transition hover:-translate-y-1">
            <span className="text-xs font-extrabold tracking-widest text-[#a17b3e]">02 / SHARAF</span>
            <h3 className="mt-3 text-2xl font-black text-ink">Memahami perubahan kata</h3>
            <p className="mt-2 max-w-md text-sm leading-7 text-[#68766e]">Pelajari wazan, mauzun, tashrif, dan pembentukan kata dalam Bahasa Arab.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-forest">Jelajahi Sharaf <ArrowRight size={16} /></span>
          </Link>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-7"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-forest">Materi terbaru</p><h2 className="mt-2 text-3xl font-black text-ink">Pilih materi untuk dipelajari</h2></div>
        {featured.length ? <div className="grid gap-5 md:grid-cols-3">{featured.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}</div> : <div className="surface p-8 text-center text-[#68766e]">Materi belum tersedia. Admin dapat menambahkan materi melalui dashboard.</div>}
      </section>
    </>
  );
}
