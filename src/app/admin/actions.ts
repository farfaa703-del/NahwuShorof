"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  return { supabase, user };
}

function makeSlug(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lessonPayload(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const subject = String(formData.get("subject") ?? "nahwu");
  const summary = String(formData.get("summary") ?? "").trim();
  const level = String(formData.get("level") ?? "Dasar").trim();
  const contentText = String(formData.get("content") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const published = formData.get("published") === "on";
  const orderNo = Number(formData.get("order_no") ?? 1);

  if (!title || !summary || !contentText) throw new Error("Judul, ringkasan, dan isi materi wajib diisi.");
  if (subject !== "nahwu" && subject !== "sharaf") throw new Error("Kategori materi tidak valid.");

  return {
    title,
    slug: makeSlug(slugInput || title),
    subject,
    summary,
    level,
    order_no: Number.isFinite(orderNo) ? orderNo : 1,
    published,
    content: [{ heading: "Materi", body: contentText }]
  };
}

export async function createLesson(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  let payload;
  try { payload = lessonPayload(formData); } catch (error) {
    redirect(`/admin/lessons/new?error=${encodeURIComponent(error instanceof Error ? error.message : "Data tidak valid")}`);
  }
  const { error } = await supabase.from("lessons").insert({ ...payload, created_by: user.id });
  if (error) redirect(`/admin/lessons/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/nahwu");
  revalidatePath("/sharaf");
  revalidatePath("/admin");
  redirect("/admin?success=Materi%20berhasil%20ditambahkan");
}

export async function updateLesson(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  let payload;
  try { payload = lessonPayload(formData); } catch (error) {
    redirect(`/admin/lessons/${id}/edit?error=${encodeURIComponent(error instanceof Error ? error.message : "Data tidak valid")}`);
  }
  const { error } = await supabase.from("lessons").update(payload).eq("id", id);
  if (error) redirect(`/admin/lessons/${id}/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/nahwu");
  revalidatePath("/sharaf");
  revalidatePath("/admin");
  redirect("/admin?success=Materi%20berhasil%20diperbarui");
}

export async function deleteLesson(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/nahwu");
  revalidatePath("/sharaf");
  revalidatePath("/admin");
  redirect("/admin?success=Materi%20berhasil%20dihapus");
}
