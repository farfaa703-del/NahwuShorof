import Link from "next/link";
import { BookOpen, GraduationCap, LayoutDashboard, LogIn, LogOut, Menu } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/auth/actions";

export async function Header() {
  let user: User | null = null;
  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e9e5d9] bg-[#faf8f1]/95 backdrop-blur">
      <div className="container-page flex min-h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest text-white"><BookOpen size={21} /></span>
          <span>
            <span className="block text-base font-extrabold tracking-tight text-ink">Nahwu Sharaf</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-forest">Academy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#53645c] md:flex">
          <Link className="hover:text-forest" href="/nahwu">Belajar Nahwu</Link>
          <Link className="hover:text-forest" href="/sharaf">Belajar Sharaf</Link>
          <Link className="hover:text-forest" href="/tashrif">Tabel Tashrif</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-secondary !px-3 !py-2 text-sm"><LayoutDashboard size={16} /> Dashboard</Link>
              <form action={logout}>
                <button className="hidden items-center gap-2 rounded-full border border-[#e4e0d5] px-3 py-2 text-sm font-semibold text-[#53645c] hover:bg-white sm:flex" type="submit"><LogOut size={15} /> Keluar</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 px-3 py-2 text-sm font-bold text-forest sm:flex"><LogIn size={16} /> Masuk</Link>
              <Link href="/register" className="btn-primary !px-4 !py-2 text-sm"><GraduationCap size={16} /> Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
