"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { fetchBeds } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

interface BedResponse {
  id: string;
  bed_number: string;
  supports_elderly: boolean;
  status: string;
  equipment: Record<string, string>;
  room: {
    room_number: string;
    room_type: string;
    accessibility_notes: string;
    ward: {
      name: string;
      department: string;
      floor: number;
      has_elderly_support: boolean;
    };
  };
}

export default function RoomsPage() {
  const [beds, setBeds] = useState<BedResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          setError("Silakan login untuk melihat ketersediaan kamar.");
          return;
        }
        const data = (await fetchBeds(token)) as BedResponse[];
        setBeds(data);
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-comfort">
        <h1 className="text-4xl font-semibold text-primary-700">Ketersediaan Kamar & Tempat Tidur</h1>
        <p className="mt-2 text-lg">
          Informasi real-time tentang ketersediaan bed di seluruh ward. Semua kamar dilengkapi fasilitas ramah lansia.
        </p>

        {error && (
          <p className="mt-6 rounded-2xl bg-primary-100 px-4 py-3 text-lg text-primary-700">
            {error}. Pastikan backend berjalan di <strong>http://localhost:8000</strong>.
          </p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {beds.map((bed) => (
            <Card
              key={bed.id}
              title={`Ward ${bed.room.ward.name} • Lantai ${bed.room.ward.floor}`}
              className="bg-comfort"
              description={`${bed.room.room_type} - Ruang ${bed.room.room_number}`}
            >
              <p className="text-lg">
                Status:{" "}
                <span className="font-semibold text-primary-700">
                  {bed.status === "AVAILABLE" ? "Tersedia" : "Tidak Tersedia"}
                </span>
              </p>
              <p className="text-lg">
                Fasilitas lansia: {bed.supports_elderly ? "Ya, terdapat pegangan & kursi roda" : "Standar"}
              </p>
              {bed.room.accessibility_notes && (
                <p className="text-lg text-elderText/80">Catatan akses: {bed.room.accessibility_notes}</p>
              )}
              {Object.keys(bed.equipment || {}).length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-lg">
                  {Object.entries(bed.equipment).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
          {beds.length === 0 && !error && (
            <Card title="Belum ada data bed" description="Tambahkan data melalui dashboard admin atau jalankan migrasi." />
          )}
        </div>
      </div>
    </div>
  );
}

