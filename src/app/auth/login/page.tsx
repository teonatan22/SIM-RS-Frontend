"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { fetchCurrentUser, loginPatient } from "@/lib/api";
import { getDashboardPath, saveAuthTokens } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    try {
      const tokens = await loginPatient(username, password);
      const user = await fetchCurrentUser(tokens.access);
      saveAuthTokens(tokens.access, tokens.refresh, user.role);
      router.replace(getDashboardPath(user.role));
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-comfort">
        <h1 className="text-4xl font-semibold text-primary-700">Masuk Portal Pasien</h1>
        <p className="mt-3 text-lg">
          Portal ini dirancang khusus bagi pasien lansia dan keluarganya. Tulisan besar dan panduan visual membantu Anda
          login dengan nyaman.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-lg">
          <div>
            <label htmlFor="username" className="mb-2 block font-semibold">
              Email atau Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border-2 border-primary-200 px-4 py-3 text-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200"
              placeholder="contoh: budi.sutopo"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-semibold">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border-2 border-primary-200 px-4 py-3 text-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200"
              placeholder="••••••••"
              required
            />
          </div>

          {message && <p className="rounded-2xl bg-primary-100 px-4 py-3 text-primary-700">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary-500 px-6 py-4 text-2xl font-semibold text-white shadow-lg focus-elevated disabled:cursor-not-allowed disabled:bg-primary-300"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8 space-y-4 text-lg">
          <Link href="/auth/register" className="text-primary-700 hover:underline">
            Belum punya akun? Aktivasi di sini.
          </Link>
          <p className="text-elderText/80">
            Jika mengalami kendala, hubungi Customer Service kami di <strong>021-14045</strong> atau kunjungi loket
            bantuan lansia.
          </p>
        </div>
      </div>
    </div>
  );
}

