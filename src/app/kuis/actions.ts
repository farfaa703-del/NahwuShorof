"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveQuizAttempt(quizId: string, answers: number[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan masuk terlebih dahulu untuk menyimpan nilai latihan." };

  const { data, error } = await supabase.rpc("submit_quiz_attempt", {
    p_quiz_id: quizId,
    p_answers: answers
  });

  if (error) {
    return { error: error.message.includes("not found")
      ? "Latihan tidak ditemukan atau belum dipublikasikan."
      : "Nilai belum berhasil disimpan. Periksa konfigurasi database dan coba lagi." };
  }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return { error: "Server tidak mengembalikan hasil penilaian." };

  revalidatePath("/dashboard");
  return { score: Number(result.score), total: Number(result.total) };
}
