import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Nahwu Sharaf Academy",
    template: "%s | Nahwu Sharaf Academy"
  },
  description: "Platform belajar Nahwu dan Sharaf dasar dengan materi, tabel tashrif, dan latihan interaktif."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <Header />
        <main className="min-h-[72vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
