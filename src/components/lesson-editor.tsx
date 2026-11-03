import type { Lesson } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  lesson?: Lesson;
  error?: string;
};

export function LessonEditor({ action, lesson, error }: Props) {
  const contentText = lesson?.content?.map((block) => block.body).join("\n\n") ?? "";
  return (
    <form action={action} className="surface space-y-5 p-6">
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-bold text-ink">Judul materi
          <input name="title" className="field mt-2" required defaultValue={lesson?.title ?? ""} placeholder="Contoh: Mengenal Isim, Fi'il, dan Huruf" />
        </label>
        <label className="block text-sm font-bold text-ink">Slug URL (opsional)
          <input name="slug" className="field mt-2" defaultValue={lesson?.slug ?? ""} placeholder="mengenal-isim-fiil-huruf" />
        </label>
        <label className="block text-sm font-bold text-ink">Kategori
          <select name="subject" className="field mt-2" defaultValue={lesson?.subject ?? "nahwu"}>
            <option value="nahwu">Nahwu</option>
            <option value="sharaf">Sharaf</option>
          </select>
        </label>
        <label className="block text-sm font-bold text-ink">Tingkat
          <select name="level" className="field mt-2" defaultValue={lesson?.level ?? "Dasar"}>
            <option>Dasar</option><option>Menengah</option><option>Lanjutan</option>
          </select>
        </label>
        <label className="block text-sm font-bold text-ink md:col-span-2">Ringkasan
          <textarea name="summary" className="field mt-2 min-h-20" required defaultValue={lesson?.summary ?? ""} placeholder="Ringkasan singkat materi..." />
        </label>
        <label className="block text-sm font-bold text-ink md:col-span-2">Isi materi
          <textarea name="content" className="field mt-2 min-h-64 leading-7" required defaultValue={contentText} placeholder="Tulis materi di sini. Pisahkan paragraf dengan baris kosong. Untuk teks Arab, tulis langsung dengan harakat jika diperlukan." />
          <span className="mt-1 block text-xs font-normal text-[#7a887f]">Teks disimpan sebagai konten materi. Gunakan baris baru untuk memisahkan paragraf.</span>
        </label>
        <label className="block text-sm font-bold text-ink">Urutan tampil
          <input name="order_no" type="number" min="1" className="field mt-2" defaultValue={lesson?.order_no ?? 1} />
        </label>
        <label className="flex items-center gap-3 self-end pb-3 text-sm font-bold text-ink">
          <input type="checkbox" name="published" defaultChecked={lesson?.published ?? true} className="h-4 w-4 accent-[#176b52]" />
          Publikasikan materi
        </label>
      </div>
      <button type="submit" className="btn-primary">Simpan materi</button>
    </form>
  );
}
