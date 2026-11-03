import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { login } from "@/app/auth/actions";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return <section className="container-page py-14"><AuthForm mode="login" action={login} error={params.error} message={params.message} /></section>;
}
