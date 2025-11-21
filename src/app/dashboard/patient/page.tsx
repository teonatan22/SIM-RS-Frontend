"use client";

import { FormEvent, useEffect, useState } from "react";

import { fetchPatientDashboard, requestAppointment, type AppointmentRequestPayload } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { PatientDashboard } from "@/types/dashboard";

export default function PatientDashboardPage() {
  const [dashboard, setDashboard] = useState<PatientDashboard | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    appointment_type: "POLYCLINIC",
    scheduled_start: "",
    scheduled_end: "",
    purpose: "",
    location: "",
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchPatientDashboard(token)
      .then(setDashboard)
      .catch(() => setMessage("Gagal memuat dashboard pasien."));
  }, []);

  const handleAppointmentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    try {
      const payload: AppointmentRequestPayload = {
        appointment_type: appointmentForm.appointment_type,
        scheduled_start: appointmentForm.scheduled_start,
        scheduled_end: appointmentForm.scheduled_end,
        purpose: appointmentForm.purpose || undefined,
        location: appointmentForm.location || undefined,
        administration_fee: 50000, // Flat 50rb
      };
      await requestAppointment(token, payload);
      setMessage("Permintaan appointment berhasil dibuat. Silakan lakukan pembayaran biaya administrasi.");
      setAppointmentForm({
        appointment_type: "POLYCLINIC",
        scheduled_start: "",
        scheduled_end: "",
        purpose: "",
        location: "",
      });
      setShowAppointmentForm(false);
      // Refresh dashboard
      const refreshed = await fetchPatientDashboard(token);
      setDashboard(refreshed);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-700",
      CONFIRMED: "bg-blue-100 text-blue-700",
      CHECKED_IN: "bg-green-100 text-green-700",
      COMPLETED: "bg-primary-100 text-primary-700",
      CANCELLED: "bg-red-100 text-red-700",
      PAID: "bg-green-100 text-green-700",
      WAITING: "bg-yellow-100 text-yellow-700",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-primary-700">Dashboard Pasien</h1>
          <button
            onClick={() => setShowAppointmentForm(!showAppointmentForm)}
            className="rounded-full bg-primary-500 px-6 py-3 text-lg font-semibold text-white"
          >
            {showAppointmentForm ? "Batal" : "Daftar Pengecekan"}
          </button>
        </div>
        {message && (
          <p className={`mt-4 rounded-2xl px-4 py-3 ${
            message.includes("berhasil") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </p>
        )}
        
        {showAppointmentForm && (
          <div className="mt-6 rounded-3xl bg-calm p-6">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">Daftar Pengecekan / Berobat</h2>
            <form onSubmit={handleAppointmentSubmit} className="grid gap-4 md:grid-cols-2 text-lg">
              <label className="flex flex-col gap-2">
                <span>Jenis Pemeriksaan</span>
                <select
                  value={appointmentForm.appointment_type}
                  onChange={(e) => setAppointmentForm((prev) => ({ ...prev, appointment_type: e.target.value }))}
                  className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                  required
                >
                  <option value="POLYCLINIC">Poli Klinik</option>
                  <option value="CONTROL">Kontrol / Follow-up</option>
                  <option value="TELEMEDICINE">Telemedicine</option>
                  <option value="HOME_VISIT">Kunjungan Rumah</option>
                </select>
              </label>
              <div className="flex flex-col gap-2 md:col-span-2">
                <span className="text-lg font-semibold text-primary-700">Biaya Administrasi</span>
                <p className="text-2xl font-bold text-primary-600">Rp 50.000</p>
                <p className="text-sm text-elderText/70">Biaya administrasi flat untuk semua jenis pemeriksaan</p>
              </div>
              <label className="flex flex-col gap-2">
                <span>Tanggal & Waktu Mulai</span>
                <input
                  type="datetime-local"
                  value={appointmentForm.scheduled_start}
                  onChange={(e) => setAppointmentForm((prev) => ({ ...prev, scheduled_start: e.target.value }))}
                  className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span>Tanggal & Waktu Selesai</span>
                <input
                  type="datetime-local"
                  value={appointmentForm.scheduled_end}
                  onChange={(e) => setAppointmentForm((prev) => ({ ...prev, scheduled_end: e.target.value }))}
                  className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span>Tujuan Pemeriksaan</span>
                <textarea
                  value={appointmentForm.purpose}
                  onChange={(e) => setAppointmentForm((prev) => ({ ...prev, purpose: e.target.value }))}
                  className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                  rows={3}
                  placeholder="Jelaskan keluhan atau tujuan pemeriksaan"
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span>Lokasi (Opsional)</span>
                <input
                  value={appointmentForm.location}
                  onChange={(e) => setAppointmentForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                  placeholder="Contoh: Poli Umum, Poli Jantung, dll"
                />
              </label>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary-500 px-6 py-4 text-2xl font-semibold text-white"
                >
                  Daftar & Bayar Administrasi
                </button>
              </div>
            </form>
          </div>
        )}
        {dashboard ? (
          <div className="mt-6 space-y-6">
            {/* Active Bed Allocation */}
            {dashboard.active_bed_allocation && (
              <div className="rounded-3xl bg-primary-50 p-6">
                <h2 className="text-2xl font-semibold text-primary-700 mb-4">Rawat Inap Aktif</h2>
                <div className="grid gap-4 md:grid-cols-2 text-lg">
                  <div>
                    <p className="text-sm text-elderText/70">Kamar & Tempat Tidur</p>
                    <p className="font-semibold text-primary-700">
                      {dashboard.active_bed_allocation.ward} - Ruang {dashboard.active_bed_allocation.room} - Bed{" "}
                      {dashboard.active_bed_allocation.bed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-elderText/70">Tanggal Masuk</p>
                    <p className="font-semibold text-primary-700">
                      {formatDate(dashboard.active_bed_allocation.admitted_at)}
                    </p>
                  </div>
                  {dashboard.active_bed_allocation.attending_staff && (
                    <div>
                      <p className="text-sm text-elderText/70">Dokter Penanggung Jawab</p>
                      <p className="font-semibold text-primary-700">
                        {dashboard.active_bed_allocation.attending_staff}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming Appointments */}
            <div className="rounded-3xl bg-white border-2 border-primary-100 p-6">
              <h2 className="text-2xl font-semibold text-primary-700 mb-4">Jadwal Mendatang</h2>
              {dashboard.upcoming_appointments.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.upcoming_appointments.map((appointment) => (
                    <div key={appointment.id} className="rounded-2xl bg-calm p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-lg font-semibold text-primary-700">{appointment.doctor}</p>
                          <p className="text-sm text-elderText/70">{appointment.location || "Belum ditentukan"}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-lg text-elderText">{formatDate(appointment.start)}</p>
                      {appointment.purpose && (
                        <p className="mt-2 text-sm text-elderText/70">Tujuan: {appointment.purpose}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-elderText/70">Tidak ada jadwal mendatang</p>
              )}
            </div>

            {/* Recent Payments */}
            <div className="rounded-3xl bg-white border-2 border-primary-100 p-6">
              <h2 className="text-2xl font-semibold text-primary-700 mb-4">Riwayat Pembayaran</h2>
              {dashboard.recent_payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-lg">
                    <thead>
                      <tr className="border-b border-primary-100 text-primary-700">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Jumlah</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recent_payments.map((payment) => (
                        <tr key={payment.id} className="border-b border-primary-50">
                          <td className="py-3">{payment.order_id}</td>
                          <td className="py-3 font-semibold">{formatCurrency(payment.amount)}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3">{formatDate(payment.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-lg text-elderText/70">Belum ada riwayat pembayaran</p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-lg">Memuat data...</p>
        )}
      </section>
    </div>
  );
}

