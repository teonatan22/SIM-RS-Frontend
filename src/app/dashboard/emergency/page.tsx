"use client";

import { useEffect, useState } from "react";

import { fetchEmergencyDashboard } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { EmergencyDashboard } from "@/types/dashboard";

export default function EmergencyDashboardPage() {
  const [data, setData] = useState<EmergencyDashboard | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchEmergencyDashboard(token)
      .then(setData)
      .catch(() => setMessage("Gagal memuat dashboard IGD."));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h1 className="text-3xl font-semibold text-primary-700">Dashboard IGD & Ambulans</h1>
        {data ? (
          <div className="mt-6 grid gap-6 md:grid-cols-3 text-lg">
            <div className="rounded-3xl bg-calm p-6">
              <p className="text-sm uppercase text-elderText/70">Kasus 24 Jam Terakhir</p>
              <p className="mt-2 text-3xl font-semibold text-primary-700">{data.cases_last_24h}</p>
            </div>
            <div className="rounded-3xl bg-calm p-6 md:col-span-2">
              <p className="text-sm uppercase text-elderText/70">Bed Reserved</p>
              <ul className="mt-2 space-y-1 text-lg">
                {data.reserved_beds.map((bed) => (
                  <li key={`${bed.ward}-${bed.room}-${bed.bed}`}>
                    {bed.ward} • Ruang {bed.room} • Bed {bed.bed}
                  </li>
                ))}
                {data.reserved_beds.length === 0 && <li>Tidak ada bed yang sedang disiapkan.</li>}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-lg">Memuat data...</p>
        )}
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h2 className="text-2xl font-semibold text-primary-700">Kasus Terbaru</h2>
        <div className="mt-4 space-y-3">
          {data?.recent_cases?.map((caseItem) => (
            <div key={caseItem.id} className="rounded-3xl bg-calm p-6">
              <p className="text-xl font-semibold text-primary-700">{caseItem.patient}</p>
              <p>Severity: {caseItem.severity}</p>
              <p>Tiba: {new Date(caseItem.arrival_time).toLocaleString()}</p>
              <p>Dokter: {caseItem.attending_physician ?? "Belum ditetapkan"}</p>
            </div>
          ))}
          {data?.recent_cases?.length === 0 && <p>Tidak ada data terbaru.</p>}
        </div>
        {message && <p className="mt-4 rounded-2xl bg-primary-100 px-4 py-3 text-primary-700">{message}</p>}
      </section>
    </div>
  );
}

