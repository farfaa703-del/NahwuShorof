import { createClient } from "@/lib/supabase/server";
import type { Lesson, Subject } from "@/lib/types";

export async function getPublishedLessons(subject?: Subject): Promise<Lesson[]> {
  const supabase = await createClient();
  let query = supabase
    .from("lessons")
    .select("*")
    .eq("published", true)
    .order("order_no", { ascending: true });

  if (subject) query = query.eq("subject", subject);

  const { data, error } = await query;
  if (error) {
    console.error("Gagal mengambil materi:", error.message);
    return [];
  }
  return (data ?? []) as Lesson[];
}

export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Lesson;
}
