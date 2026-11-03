import type { Metadata } from "next";
import { ArabicText } from "@/components/arabic-text";

export const metadata: Metadata = { title: "Tabel Tashrif" };

const forms = [
  ["هُوَ", "فَعَلَ", "يَفْعَلُ", "—"],
  ["هُمَا", "فَعَلَا", "يَفْعَلَانِ", "—"],
  ["هُمْ", "فَعَلُوا", "يَفْعَلُونَ", "—"],
  ["هِيَ", "فَعَلَتْ", "تَفْعَلُ", "—"],
  ["هُمَا", "فَعَلَتَا", "تَفْعَلَانِ", "—"],
  ["هُنَّ", "فَعَلْنَ", "يَفْعَلْنَ", "—"],
  ["أَنْتَ", "فَعَلْتَ", "تَفْعَلُ", "اِفْعَلْ"],
  ["أَنْتُمَا", "فَعَلْتُمَا", "تَفْعَلَانِ", "اِفْعَلَا"],
  ["أَنْتُمْ", "فَعَلْتُمْ", "تَفْعَلُونَ", "اِفْعَلُوا"],
  ["أَنْتِ", "فَعَلْتِ", "تَفْعَلِينَ", "اِفْعَلِي"],
  ["أَنْتُمَا", "فَعَلْتُمَا", "تَفْعَلَانِ", "اِفْعَلَا"],
  ["أَنْتُنَّ", "فَعَلْتُنَّ", "تَفْعَلْنَ", "اِفْعَلْنَ"],
  ["أَنَا", "فَعَلْتُ", "أَفْعَلُ", "—"],
  ["نَحْنُ", "فَعَلْنَا", "نَفْعَلُ", "—"]
];

export default function TashrifPage() {
  return (
    <section className="container-page py-12">
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-forest">Alat bantu belajar</p>
      <h1 className="mt-2 text-4xl font-black text-ink">Tabel Tashrif Lughawi</h1>
      <p className="mt-4 max-w-3xl leading-7 text-[#68766e]">Contoh pola dasar perubahan fi'il berdasarkan dhamir. Tabel ini menggunakan pola فَعَلَ sebagai model pembelajaran. Bentuk aktual dapat berubah mengikuti jenis fi'il dan wazan.</p>
      <div className="surface mt-8 overflow-x-auto p-3 sm:p-5">
        <table className="w-full min-w-[680px] border-collapse text-center">
          <thead><tr className="bg-[#edf4ed] text-sm text-ink"><th className="p-3">Dhamir</th><th className="p-3">Fi'il Madhi</th><th className="p-3">Fi'il Mudhari'</th><th className="p-3">Fi'il Amr</th></tr></thead>
          <tbody>
            {forms.map((row, index) => <tr key={index} className="border-b border-[#efede6] last:border-0"><td className="p-3 text-sm font-bold text-[#66766d]">{row[0]}</td><td className="p-3"><ArabicText className="text-xl">{row[1]}</ArabicText></td><td className="p-3"><ArabicText className="text-xl">{row[2]}</ArabicText></td><td className="p-3"><ArabicText className="text-xl">{row[3]}</ArabicText></td></tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-6 text-[#829087]">Catatan akademik: tabel ini merupakan pola pengantar. Sebelum dipakai sebagai bahan evaluasi formal, validasi seluruh bentuk tashrif berdasarkan kitab atau referensi sharaf yang digunakan lembaga.</p>
    </section>
  );
}
