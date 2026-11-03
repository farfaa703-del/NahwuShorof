import Link from "next/link";

type Props = {
  mode: "login" | "register";
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
  message?: string;
};

export function AuthForm({ mode, action, error, message }: Props) {
  const isRegister = mode === "register";
  return (
    <div className="surface mx-auto w-full max-w-md p-7 sm:p-9">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-moss text-forest">بِسْمِ</div>
        <h1 className="text-2xl font-extrabold text-ink">{isRegister ? "Buat akun belajar" : "Selamat datang kembali"}</h1>
        <p className="mt-2 text-sm text-[#68766e]">{isRegister ? "Daftar untuk menyimpan progres dan hasil latihan." : "Masuk untuk melanjutkan proses belajar."}</p>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}

      <form action={action} className="space-y-4">
        {isRegister && (
          <label className="block text-sm font-semibold text-ink">
            Nama lengkap
            <input className="field mt-2" name="full_name" required minLength={2} placeholder="Nama lengkap" />
          </label>
        )}
        <label className="block text-sm font-semibold text-ink">
          Email
          <input className="field mt-2" name="email" type="email" required placeholder="nama@email.com" />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Kata sandi
          <input className="field mt-2" name="password" type="password" required minLength={6} placeholder="Minimal 6 karakter" />
        </label>
        <button className="btn-primary w-full !py-3" type="submit">{isRegister ? "Daftar sekarang" : "Masuk ke akun"}</button>
      </form>

      <p className="mt-6 text-center text-sm text-[#68766e]">
        {isRegister ? "Sudah memiliki akun?" : "Belum memiliki akun?"}{" "}
        <Link className="font-bold text-forest" href={isRegister ? "/login" : "/register"}>{isRegister ? "Masuk" : "Daftar"}</Link>
      </p>
    </div>
  );
}
