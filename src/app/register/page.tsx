import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { register } from "@/app/auth/actions";

export const metadata: Metadata = { title: "Daftar akun" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <section className="container-page py-14"><AuthForm mode="register" action={register} error={params.error} /></section>;
}
