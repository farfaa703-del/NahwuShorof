import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ClipboardCheck, ShieldCheck, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: attempts }, { count: lessonCount }] = await Promise.all([
    supabase.from("profiles").select("full_name,role").eq("id", user.id).single(),
    supabase.from("quiz_attempts").select("id,score,total,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    supabase.from("lessons").select("*", { count: "exact", head: true }).eq("published", true)
  ]);

  const totalAttempts = attempts?.length ?? 0;
  const average = totalAttempts ? Math.round(attempts!.reduce((sum, item) => sum + (item.total ? item.score / item.total * 100 : 0), 0) / totalAttempts) : 0;

  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-forest">Dashboard belajar</p><h1 className="mt-2 text-3xl font-black text-ink">Assalamu'alaikum, {profile?.full_name || "Siswa"}.</h1><p className="mt-2 text-sm text-[#68766e]">Pantau materi dan hasil latihanmu di sini.</p></div>
        {profile?.role === "admin" && <Link href="/admin" className="btn-primary"><ShieldCheck size={16} /> Panel admin</Link>}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="surface p-5"><BookOpen className="text-forest" size={22} /><p className="mt-4 text-3xl font-black text-ink">{lessonCount ?? 0}</p><p className="mt-1 text-sm text-[#68766e]">Materi tersedia</p></div>
        <div className="surface p-5"><ClipboardCheck className="text-forest" size={22} /><p className="mt-4 text-3xl font-black text-ink">{totalAttempts}</p><p className="mt-1 text-sm text-[#68766e]">Latihan dikerjakan</p></div>
        <div className="surface p-5"><TrendingUp className="text-forest" size={22} /><p className="mt-4 text-3xl font-black text-ink">{average}%</p><p className="mt-1 text-sm text-[#68766e]">Rata-rata nilai terbaru</p></div>
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="surface p-6">
          <h2 className="text-xl font-extrabold text-ink">Riwayat latihan</h2>
          {attempts?.length ? <div className="mt-4 divide-y divide-[#efede6]">{attempts.map((attempt) => <div key={attempt.id} className="flex items-center justify-between gap-3 py-4"><div><p className="font-bold text-ink">Latihan #{attempt.id.slice(0, 8)}</p><p className="mt-1 text-xs text-[#829087]">{new Date(attempt.created_at).toLocaleString("id-ID")}</p></div><span className="rounded-full bg-moss px-3 py-1 text-sm font-extrabold text-forest">{attempt.score}/{attempt.total}</span></div>)}</div> : <p className="mt-4 text-sm text-[#68766e]">Kamu belum mengerjakan latihan. Buka materi dan kerjakan kuis untuk mulai mengumpulkan progres.</p>}
        </div>
        <aside className="surface h-fit p-6">
          <h2 className="font-extrabold text-ink">Lanjutkan belajar</h2>
          <p className="mt-2 text-sm leading-6 text-[#68766e]">Pilih cabang ilmu yang ingin kamu pelajari hari ini.</p>
          <div className="mt-5 grid gap-2"><Link className="btn-secondary" href="/nahwu">Materi Nahwu</Link><Link className="btn-secondary" href="/sharaf">Materi Sharaf</Link><Link className="btn-secondary" href="/tashrif">Tabel Tashrif</Link></div>
        </aside>
      </div>
    </section>
  );
}
