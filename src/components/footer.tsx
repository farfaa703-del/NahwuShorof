import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e9e5d9] bg-white/60">
      <div className="container-page flex flex-col justify-between gap-4 py-8 text-sm text-[#68766e] md:flex-row md:items-center">
        <div>
          <p className="font-bold text-ink">Nahwu Sharaf Academy</p>
          <p className="mt-1">Belajar kaidah Bahasa Arab secara bertahap dan terarah.</p>
        </div>
        <div className="flex gap-5 font-semibold">
          <Link href="/nahwu">Nahwu</Link>
          <Link href="/sharaf">Sharaf</Link>
          <Link href="/tashrif">Tashrif</Link>
        </div>
        <p>© {new Date().getFullYear()} Nahwu Sharaf Academy</p>
      </div>
    </footer>
  );
}
