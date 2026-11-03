"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { QuizQuestion } from "@/lib/types";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  return supabase;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (!isRecord(value)) return false;
  const options = value.options;
  const answer = value.answer;

  return (
    typeof value.question === "string" &&
    value.question.trim().length > 0 &&
    Array.isArray(options) &&
    options.length === 4 &&
    options.every((option: unknown) => typeof option === "string" && option.trim().length > 0) &&
    typeof answer === "number" &&
    Number.isInteger(answer) &&
    answer >= 0 &&
    answer <= 3 &&
    (value.explanation === undefined || typeof value.explanation === "string")
  );
}

function parseQuiz(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const lessonId = String(formData.get("lesson_id") ?? "").trim();
  const published = formData.get("published") === "on";
  let parsedQuestions: unknown;

  try {
    parsedQuestions = JSON.parse(String(formData.get("questions") ?? "[]"));
  } catch {
    throw new Error("Format pertanyaan tidak valid.");
  }

  if (!title || !lessonId) throw new Error("Judul kuis dan materi wajib dipilih.");
  if (!Array.isArray(parsedQuestions) || parsedQuestions.length < 1) {
    throw new Error("Tambahkan minimal satu pertanyaan.");
  }

  const questions: unknown[] = parsedQuestions;
  if (!questions.every(isQuizQuestion)) {
    throw new Error("Setiap soal harus memiliki pertanyaan, empat opsi, dan satu jawaban benar.");
  }

  return { title, lesson_id: lessonId, published, questions: questions as QuizQuestion[] };
}

export async function createQuiz(formData: FormData) {
  const supabase = await requireAdmin();
  let payload;
  try { payload = parseQuiz(formData); } catch (error) {
    redirect(`/admin/quizzes/new?error=${encodeURIComponent(error instanceof Error ? error.message : "Data kuis tidak valid")}`);
  }
  const { error } = await supabase.from("quizzes").insert(payload);
  if (error) redirect(`/admin/quizzes/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/quizzes");
  revalidatePath("/materi");
  redirect("/admin/quizzes?success=Kuis%20berhasil%20ditambahkan");
}

export async function updateQuiz(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  let payload;
  try { payload = parseQuiz(formData); } catch (error) {
    redirect(`/admin/quizzes/${id}/edit?error=${encodeURIComponent(error instanceof Error ? error.message : "Data kuis tidak valid")}`);
  }
  const { error } = await supabase.from("quizzes").update(payload).eq("id", id);
  if (error) redirect(`/admin/quizzes/${id}/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/quizzes");
  redirect("/admin/quizzes?success=Kuis%20berhasil%20diperbarui");
}

export async function deleteQuiz(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  if (error) redirect(`/admin/quizzes?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/quizzes");
  redirect("/admin/quizzes?success=Kuis%20berhasil%20dihapus");
}
