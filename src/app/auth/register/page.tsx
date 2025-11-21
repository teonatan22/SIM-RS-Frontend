"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { registerPatient, type RegisterPatientPayload } from "@/lib/api";

const genderOptions = [
  { value: "MALE", label: "Laki-laki" },
  { value: "FEMALE", label: "Perempuan" },
  { value: "OTHER", label: "Lainnya" },
  { value: "UNDISCLOSED", label: "Tidak ingin menyebutkan" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    national_id: "",
    date_of_birth: "",
    gender: "UNDISCLOSED",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange =
    (field: keyof typeof formState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setSuccess(false);

    const payload: RegisterPatientPayload = {
      email: formState.email,
      username: formState.username,
      password: formState.password,
      first_name: formState.first_name || undefined,
      last_name: formState.last_name || undefined,
      phone_number: formState.phone_number || undefined,
      national_id: formState.national_id || undefined,
      date_of_birth: formState.date_of_birth || undefined,
      gender: formState.gender || "UNDISCLOSED",
    };

    try {
      await registerPatient(payload);
      setSuccess(true);
      setMessage("Akun berhasil dibuat. Silakan masuk dengan kredensial yang baru.");
      setTimeout(() => router.replace("/auth/login"), 2000);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-comfort">
        <h1 className="text-4xl font-semibold text-primary-700">Daftar Akun Pasien</h1>
        <p className="mt-3 text-lg">
          Isi formulir di bawah ini untuk membuat akun SIM-RS+. Tulisan besar dan kontras tinggi dirancang agar mudah
          dibaca oleh pasien lansia maupun pendamping.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 text-lg">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Email</span>
              <input
                type="email"
                value={formState.email}
                onChange={handleChange("email")}
                className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Username</span>
              <input
                value={formState.username}
                onChange={handleChange("username")}
                className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span>Kata Sandi</span>
            <input
              type="password"
              value={formState.password}
              onChange={handleChange("password")}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Nama Depan</span>
              <input
                value={formState.first_name}
                onChange={handleChange("first_name")}
                className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                placeholder="opsional"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Nama Belakang</span>
              <input
                value={formState.last_name}
                onChange={handleChange("last_name")}
                className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                placeholder="opsional"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Nomor Telepon</span>
              <input
                value={formState.phone_number}
                onChange={handleChange("phone_number")}
                className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                placeholder="opsional"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>NIK / Nomor Identitas</span>
              <input
                value={formState.national_id}
                onChange={handleChange("national_id")}
                className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                placeholder="opsional"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span>Tanggal Lahir</span>
              <input
                type="date"
                value={formState.date_of_birth}
                onChange={handleChange("date_of_birth")}
                className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Jenis Kelamin</span>
              <select
                value={formState.gender}
                onChange={handleChange("gender")}
                className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary-500 px-6 py-4 text-2xl font-semibold text-white shadow-lg focus-elevated disabled:cursor-not-allowed disabled:bg-primary-300"
          >
            {isSubmitting ? "Memproses..." : "Buat Akun"}
          </button>

          {message && (
            <p
              className={`rounded-2xl px-4 py-3 ${
                success ? "bg-primary-100 text-primary-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

