import Link from "next/link";

export default function NotFound() {
  return <section className="container-page py-24 text-center"><p className="text-sm font-extrabold uppercase tracking-widest text-forest">404</p><h1 className="mt-3 text-3xl font-black text-ink">Halaman tidak ditemukan</h1><p className="mt-3 text-[#68766e]">Materi atau halaman yang kamu cari tidak tersedia.</p><Link href="/" className="btn-primary mt-7">Kembali ke beranda</Link></section>;
}
