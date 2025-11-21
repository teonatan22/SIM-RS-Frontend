"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/Card";

const triageLevels = [
  {
    name: "Merah",
    description: "Kondisi gawat darurat, butuh tindakan segera. Hubungi petugas IGD saat tiba.",
  },
  {
    name: "Kuning",
    description: "Butuh penanganan cepat dalam 10 menit. Tetap dampingi pasien lansia.",
  },
  {
    name: "Hijau",
    description: "Kondisi stabil. Pasien akan diarahkan ke ruang observasi dengan fasilitas ramah lansia.",
  },
];

export default function IGDPage() {
  const [estimatedArrival, setEstimatedArrival] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-comfort">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-primary-700">Instalasi Gawat Darurat</h1>
            <p className="mt-2 text-lg">
              Laporkan kedatangan pasien lansia agar tim IGD dan ambulans kami siap menyambut dengan jalur prioritas.
            </p>
          </div>
          <Link
            href="tel:0211234911"
            className="rounded-full bg-accent-500 px-6 py-3 text-xl font-semibold text-white shadow-lg focus-elevated"
          >
            Hotline 021-1234-911
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {triageLevels.map((level) => (
            <Card key={level.name} title={`Triase ${level.name}`} description={level.description} className="text-lg" />
          ))}
        </section>

        <section className="mt-10">
          <Card title="Form Pra-IGD" description="Isi data singkat untuk mempersiapkan tim IGD menyambut pasien." className="bg-white">
            <form onSubmit={handleSubmit} className="grid gap-5 text-lg">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-1 font-semibold">Perkiraan Waktu Tiba</span>
                  <input
                    type="time"
                    className="rounded-2xl border-2 border-primary-200 px-4 py-3 text-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200"
                    value={estimatedArrival}
                    onChange={(event) => setEstimatedArrival(event.target.value)}
                    required
                  />
                </label>
                <label className="flex flex-col">
                  <span className="mb-1 font-semibold">Nomor Kontak Pendamping</span>
                  <input
                    type="tel"
                    className="rounded-2xl border-2 border-primary-200 px-4 py-3 text-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200"
                    placeholder="contoh: 0812-3456-7890"
                    required
                  />
                </label>
              </div>
              <label className="flex flex-col">
                <span className="mb-1 font-semibold">Catatan Kondisi / Alat Bantu Pasien</span>
                <textarea
                  className="min-h-[120px] rounded-2xl border-2 border-primary-200 px-4 py-3 text-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200"
                  placeholder="contoh: menggunakan kursi roda, alergi obat tertentu, memiliki riwayat diabetes..."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-primary-500 px-6 py-4 text-2xl font-semibold text-white focus-elevated"
              >
                Kirim Informasi IGD
              </button>
            </form>
            {submitted && (
              <p className="rounded-2xl bg-primary-100 px-4 py-3 text-lg text-primary-700">
                Informasi Anda diterima. Tim IGD akan siap menyambut pasien sesuai jalur prioritas lansia.
              </p>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}

