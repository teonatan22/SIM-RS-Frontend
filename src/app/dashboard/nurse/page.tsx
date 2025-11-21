"use client";

import { useEffect, useState } from "react";

import { fetchNurseDashboard, updateBedAllocation } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { NurseDashboard } from "@/types/dashboard";

export default function NurseDashboardPage() {
  const [data, setData] = useState<NurseDashboard | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchNurseDashboard(token)
      .then(setData)
      .catch(() => setMessage("Gagal memuat dashboard perawat."));
  }, []);

  const handleDischarge = async (allocationId: string) => {
    const token = getAccessToken();
    if (!token) return;
    try {
      await updateBedAllocation(token, allocationId, {
        discharged_at: new Date().toISOString(),
      });
      const refreshed = await fetchNurseDashboard(token);
      setData(refreshed);
      setMessage("Pasien ditandai selesai. Bed dialihkan ke status cleaning.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h1 className="text-3xl font-semibold text-primary-700">Dashboard Perawat</h1>
        <p className="mt-2 text-lg text-elderText/80">
          Pantau pasien rawat inap dan update status bed setelah pasien dipindahkan atau pulang.
        </p>
        <div className="mt-6 space-y-3">
          {data ? (
            data.active_allocations.map((alloc) => (
              <div key={alloc.allocation_id ?? `${alloc.patient}-${alloc.bed}`} className="rounded-3xl bg-calm p-6">
                <div className="flex flex-col gap-2 text-lg lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-primary-700">{alloc.patient}</p>
                    <p>
                      {alloc.ward} • Ruang {alloc.room} • Bed {alloc.bed}
                    </p>
                    <p className="text-sm text-elderText/70">
                      Penanggung jawab: {alloc.attending_staff ?? "Belum ditetapkan"}
                    </p>
                    <p className="text-sm text-elderText/70">Status Bed: {alloc.status}</p>
                  </div>
                  <button
                    onClick={() => handleDischarge(alloc.allocation_id)}
                    className="rounded-full bg-primary-500 px-5 py-2 text-white"
                  >
                    Tandai Selesai
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Memuat data...</p>
          )}
        </div>
        {message && <p className="mt-4 rounded-2xl bg-primary-100 px-4 py-3 text-primary-700">{message}</p>}
      </section>
    </div>
  );
}

