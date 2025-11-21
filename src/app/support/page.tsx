"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-comfort space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-semibold text-primary-700">Pusat Bantuan SIM-RS</h1>
          <p className="text-lg">
            Tim kami siap membantu pasien lansia, keluarga, dan seluruh aktor rumah sakit. Pilih kanal yang paling nyaman
            untuk Anda.
          </p>
        </header>

        <Card title="Kontak Utama" className="bg-comfort">
          <ul className="space-y-3 text-lg">
            <li>
              <strong>Customer Service Lansia:</strong> 021-14045 (08.00 - 20.00 WIB)
            </li>
            <li>
              <strong>Hotline IGD:</strong> 021-1234-911 (24 jam)
            </li>
            <li>
              <strong>Email:</strong> care@sim-rs.local
            </li>
          </ul>
        </Card>

        <Card title="Layanan Prioritas untuk Lansia">
          <p>
            Kami menyediakan jalur cepat, panduan audio, huruf besar, dan pendamping khusus untuk pasien lansia. Mohon beri
            tahu kebutuhan khusus Anda agar kami dapat menyiapkan fasilitas sebelum kedatangan.
          </p>
        </Card>

        <Card title="Panduan Singkat">
          <ol className="space-y-3 text-lg list-decimal pl-6">
            <li>Daftarkan akun pasien langsung melalui portal atau datang ke loket customer service.</li>
            <li>Masuk ke portal untuk melihat jadwal kontrol, IGD, dan ketersediaan kamar.</li>
            <li>Hubungi kami bila membutuhkan pendampingan menggunakan portal.</li>
          </ol>
          <div>
            <Link href="/auth/register" className="text-primary-700 font-semibold hover:underline">
              Mulai pendaftaran akun pasien →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

