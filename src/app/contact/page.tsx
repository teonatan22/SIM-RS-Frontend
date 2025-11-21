"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-comfort space-y-6">
        <h1 className="text-4xl font-semibold text-primary-700">Kontak Rumah Sakit</h1>
        <p className="text-lg">
          Hubungi kami kapan saja melalui kanal berikut. Tim khusus lansia siap membantu dengan sabar dan ramah.
        </p>
        <ul className="space-y-3 text-lg">
          <li>
            <strong>Telepon Customer Service:</strong> 021-14045
          </li>
          <li>
            <strong>WhatsApp Care:</strong> <Link href="https://wa.me/6281234567890">+62 812-3456-7890</Link>
          </li>
          <li>
            <strong>Email:</strong> care@sim-rs.local
          </li>
          <li>
            <strong>Alamat:</strong> Jl. Sehat Sentosa No. 99, Jakarta
          </li>
        </ul>
      </div>
    </div>
  );
}

