"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  createAdminUser,
  createBed,
  createRoom,
  fetchAdminUsers,
  fetchHospitalAdminDashboard,
  fetchRooms,
  fetchWards,
  type Room,
  type Ward,
} from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { AdminUser, HospitalAdminDashboard } from "@/types/dashboard";

export default function HospitalAdminDashboardPage() {
  const [dashboard, setDashboard] = useState<HospitalAdminDashboard | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "DOCTOR",
    password: "",
  });
  const [roomFormState, setRoomFormState] = useState({
    ward: "",
    room_number: "",
    room_type: "GENERAL",
    capacity: "1",
    accessibility_notes: "",
  });
  const [bedFormState, setBedFormState] = useState({
    room: "",
    bed_number: "",
    supports_elderly: true,
    status: "AVAILABLE",
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchHospitalAdminDashboard(token)
      .then(setDashboard)
      .catch(() => setMessage("Gagal memuat ringkasan hospital admin."));
    fetchAdminUsers(token)
      .then((result) => setUsers(result))
      .catch(() => setMessage("Gagal memuat daftar pengguna."));
    fetchRooms(token)
      .then((result) => setRooms(result))
      .catch(() => setMessage("Gagal memuat daftar ruangan."));
    fetchWards(token)
      .then((result) => setWards(result))
      .catch(() => setMessage("Gagal memuat daftar ward."));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    try {
      // Only include password if it's not empty
      const { password, ...restFormState } = formState;
      const payload = password ? { ...restFormState, password } : restFormState;
      const created = await createAdminUser(token, payload);
      if (created.generated_password) {
        setMessage(`Akun berhasil dibuat. Password: ${created.generated_password}`);
      } else {
        setMessage("Akun berhasil dibuat.");
      }
      setFormState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "DOCTOR",
        password: "",
      });
      const refreshed = await fetchAdminUsers(token);
      setUsers(refreshed);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const handleRoomSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    try {
      await createRoom(token, {
        ward: roomFormState.ward,
        room_number: roomFormState.room_number,
        room_type: roomFormState.room_type,
        capacity: parseInt(roomFormState.capacity),
        accessibility_notes: roomFormState.accessibility_notes || undefined,
      });
      setMessage("Ruangan berhasil ditambahkan.");
      setRoomFormState({
        ward: "",
        room_number: "",
        room_type: "GENERAL",
        capacity: "1",
        accessibility_notes: "",
      });
      // Refresh rooms
      const refreshed = await fetchRooms(token);
      setRooms(refreshed);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const handleBedSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    try {
      await createBed(token, {
        room: bedFormState.room,
        bed_number: bedFormState.bed_number,
        supports_elderly: bedFormState.supports_elderly,
        status: bedFormState.status,
        equipment: {},
      });
      setMessage("Bed berhasil ditambahkan.");
      setBedFormState({
        room: "",
        bed_number: "",
        supports_elderly: true,
        status: "AVAILABLE",
      });
      // Refresh rooms to show updated bed count
      const refreshed = await fetchRooms(token);
      setRooms(refreshed);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h1 className="text-3xl font-semibold text-primary-700">Ringkasan Hospital Admin</h1>
        {dashboard ? (
          <div className="mt-6 grid gap-6 md:grid-cols-3 text-lg">
            <div className="rounded-3xl bg-calm p-6">
              <p className="text-sm uppercase text-elderText/70">Pengguna</p>
              <ul className="mt-2 space-y-1">
                {Object.entries(dashboard.users_by_role).map(([role, total]) => (
                  <li key={role} className="flex justify-between">
                    <span>{role}</span>
                    <span className="font-semibold">{total}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-calm p-6">
              <p className="text-sm uppercase text-elderText/70">Pembayaran</p>
              <p className="mt-2">Total transaksi: {dashboard.payments.total ?? 0}</p>
              <p>Pembayaran sukses: {dashboard.payments.paid ?? 0}</p>
              <p>Menunggu pembayaran: {dashboard.payments.waiting ?? 0}</p>
            </div>
            <div className="rounded-3xl bg-calm p-6">
              <p className="text-sm uppercase text-elderText/70">Aktivasi</p>
              <p className="mt-2 text-3xl font-semibold text-primary-700">
                {dashboard.pending_activation_requests}
              </p>
              <p className="text-lg">Permintaan aktivasi menunggu verifikasi CS.</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-lg">Memuat data...</p>
        )}
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h2 className="text-2xl font-semibold text-primary-700">Buat Akun Aktor Rumah Sakit</h2>
        <p className="mt-2 text-lg text-elderText/80">
          Hospital admin dapat membuat akun untuk dokter, perawat, keuangan, dan aktor lainnya. Password dapat diisi
          secara manual atau dikosongkan untuk digenerate otomatis oleh sistem.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2 text-lg">
          <label className="flex flex-col gap-2">
            <span>Username</span>
            <input
              value={formState.username}
              onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Email</span>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Nama Depan</span>
            <input
              value={formState.first_name}
              onChange={(e) => setFormState((prev) => ({ ...prev, first_name: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Nama Belakang</span>
            <input
              value={formState.last_name}
              onChange={(e) => setFormState((prev) => ({ ...prev, last_name: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Role</span>
            <select
              value={formState.role}
              onChange={(e) => setFormState((prev) => ({ ...prev, role: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
            >
              <option value="MEDICAL_DIRECTOR">Medical Director</option>
              <option value="DOCTOR">Dokter</option>
              <option value="NURSE">Perawat</option>
              <option value="MIDWIFE">Bidan</option>
              <option value="CUSTOMER_SERVICE">Customer Service</option>
              <option value="FINANCE">Keuangan</option>
              <option value="TRIAGE">Triage</option>
              <option value="AMBULANCE">Ambulance</option>
              <option value="IT_SUPPORT">IT Support</option>
              <option value="SECURITY">Security</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>Password (Opsional)</span>
            <input
              type="password"
              value={formState.password}
              onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              placeholder="Kosongkan untuk generate otomatis"
            />
            <span className="text-sm text-elderText/70">
              Jika dikosongkan, password akan digenerate otomatis dan ditampilkan setelah akun dibuat.
            </span>
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-full bg-primary-500 px-6 py-4 text-2xl font-semibold text-white"
            >
              Buat Akun
            </button>
          </div>
        </form>
        {message && <p className="mt-4 rounded-2xl bg-primary-100 px-4 py-3 text-primary-700">{message}</p>}
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h2 className="text-2xl font-semibold text-primary-700">Tambah Ruangan</h2>
        <p className="mt-2 text-lg text-elderText/80">
          Tambahkan ruangan baru ke ward yang sudah ada. Pastikan ward sudah dibuat terlebih dahulu.
        </p>
        <form onSubmit={handleRoomSubmit} className="mt-6 grid gap-4 md:grid-cols-2 text-lg">
          <label className="flex flex-col gap-2">
            <span>Ward</span>
            <select
              value={roomFormState.ward}
              onChange={(e) => setRoomFormState((prev) => ({ ...prev, ward: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            >
              <option value="">Pilih ward</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name} ({ward.code}) - {ward.department}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>Nomor Ruangan</span>
            <input
              value={roomFormState.room_number}
              onChange={(e) => setRoomFormState((prev) => ({ ...prev, room_number: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              placeholder="Contoh: 101, 201, A1"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Jenis Ruangan</span>
            <select
              value={roomFormState.room_type}
              onChange={(e) => setRoomFormState((prev) => ({ ...prev, room_type: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            >
              <option value="GENERAL">General Ward</option>
              <option value="ICU">ICU</option>
              <option value="ISOLATION">Isolation</option>
              <option value="VIP">VIP / Suite</option>
              <option value="NICU">Neonatal ICU</option>
              <option value="MATERNITY">Maternity</option>
              <option value="ER_OBSERVATION">IGD Observation</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>Kapasitas</span>
            <input
              type="number"
              value={roomFormState.capacity}
              onChange={(e) => setRoomFormState((prev) => ({ ...prev, capacity: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              min="1"
              required
            />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Catatan Aksesibilitas (Opsional)</span>
            <textarea
              value={roomFormState.accessibility_notes}
              onChange={(e) => setRoomFormState((prev) => ({ ...prev, accessibility_notes: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              rows={3}
              placeholder="Informasi tentang akses kursi roda, fasilitas ramah lansia, dll"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-full bg-primary-500 px-6 py-4 text-2xl font-semibold text-white"
            >
              Tambah Ruangan
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h2 className="text-2xl font-semibold text-primary-700">Tambah Tempat Tidur</h2>
        <p className="mt-2 text-lg text-elderText/80">
          Tambahkan tempat tidur baru ke ruangan yang sudah ada. Pastikan ruangan sudah dibuat terlebih dahulu.
        </p>
        <form onSubmit={handleBedSubmit} className="mt-6 grid gap-4 md:grid-cols-2 text-lg">
          <label className="flex flex-col gap-2">
            <span>Ruangan</span>
            <select
              value={bedFormState.room}
              onChange={(e) => setBedFormState((prev) => ({ ...prev, room: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            >
              <option value="">Pilih ruangan</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {typeof room.ward === "object" && room.ward
                    ? `${room.ward.name} - Ruang ${room.room_number} (${room.room_type})`
                    : `Ruang ${room.room_number} (${room.room_type})`}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>Nomor Tempat Tidur</span>
            <input
              value={bedFormState.bed_number}
              onChange={(e) => setBedFormState((prev) => ({ ...prev, bed_number: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              placeholder="Contoh: 1, 2, A, B"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Status</span>
            <select
              value={bedFormState.status}
              onChange={(e) => setBedFormState((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
            >
              <option value="AVAILABLE">Tersedia</option>
              <option value="MAINTENANCE">Dalam Perawatan</option>
              <option value="CLEANING">Sedang Dibersihkan</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bedFormState.supports_elderly}
                onChange={(e) => setBedFormState((prev) => ({ ...prev, supports_elderly: e.target.checked }))}
                className="h-5 w-5"
              />
              <span>Mendukung Pasien Lansia</span>
            </span>
            <span className="text-sm text-elderText/70">
              Centang jika bed dilengkapi dengan pegangan, kursi roda, dan fasilitas ramah lansia lainnya.
            </span>
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-full bg-primary-500 px-6 py-4 text-2xl font-semibold text-white"
            >
              Tambah Tempat Tidur
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h2 className="text-2xl font-semibold text-primary-700">Daftar Aktor Terdaftar</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-lg">
            <thead>
              <tr className="border-b border-primary-100 text-primary-700">
                <th className="pb-3">Nama</th>
                <th className="pb-3">Username</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-primary-50">
                  <td className="py-3">{user.first_name ? `${user.first_name} ${user.last_name ?? ""}` : "-"}</td>
                  <td className="py-3">{user.username}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.role}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        user.is_active ? "bg-primary-100 text-primary-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

