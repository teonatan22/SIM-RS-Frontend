"use client";

import { FormEvent, useEffect, useState } from "react";

import { createPayment, fetchPayments, fetchPatients, fetchReceptionistDashboard } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { PatientSummary, ReceptionistDashboard, PaymentTransaction } from "@/types/dashboard";

export default function ReceptionistDashboardPage() {
  const [dashboard, setDashboard] = useState<ReceptionistDashboard | null>(null);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    patient_id: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchReceptionistDashboard(token)
      .then(setDashboard)
      .catch(() => setMessage("Gagal memuat ringkasan resepsionis."));
    fetchPayments(token)
      .then((result) => setPayments(result))
      .catch(() => setMessage("Gagal memuat pembayaran."));
    fetchPatients(token)
      .then((result) => setPatients(result))
      .catch(() => setMessage("Gagal memuat daftar pasien."));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    try {
      const created = await createPayment(token, {
        patient_id: formState.patient_id,
        amount: Number(formState.amount),
        description: formState.description,
      });
      setMessage(
        `Permintaan pembayaran berhasil dibuat. Snap Token: ${created.snap_token ?? "-"} | Link: ${
          created.redirect_url ?? "-"
        }`,
      );
      const updated = await fetchPayments(token);
      setPayments(updated);
      const refreshedDashboard = await fetchReceptionistDashboard(token);
      setDashboard(refreshedDashboard);
      setFormState({ patient_id: "", amount: "", description: "" });
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h1 className="text-3xl font-semibold text-primary-700">Dashboard Resepsionis</h1>
        {dashboard ? (
          <div className="mt-6 grid gap-6 md:grid-cols-3 text-lg">
            <div className="rounded-3xl bg-calm p-6">
              <p className="text-sm uppercase text-elderText/70">Total Pasien Terdaftar</p>
              <p className="mt-2 text-3xl font-semibold text-primary-700">{patients.length}</p>
            </div>
            <div className="rounded-3xl bg-calm p-6">
              <p className="text-sm uppercase text-elderText/70">Aktivasi Menunggu</p>
              <p className="mt-2 text-3xl font-semibold text-primary-700">
                {dashboard.pending_activation_requests}
              </p>
            </div>
            <div className="rounded-3xl bg-calm p-6">
              <p className="text-sm uppercase text-elderText/70">Pembayaran Menunggu</p>
              <p className="mt-2 text-3xl font-semibold text-primary-700">
                {dashboard.payments_waiting?.length ?? 0}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-lg">Memuat data...</p>
        )}
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h2 className="text-2xl font-semibold text-primary-700">Buat Permintaan Pembayaran</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2 text-lg">
          <label className="flex flex-col gap-2">
            <span>Pasien</span>
            <select
              value={formState.patient_id}
              onChange={(e) => setFormState((prev) => ({ ...prev, patient_id: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            >
              <option value="">Pilih pasien</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {(patient.user_full_name || patient.user) ?? "Pasien"} • {patient.medical_record_number}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>Nominal (IDR)</span>
            <input
              type="number"
              min={1}
              value={formState.amount}
              onChange={(e) => setFormState((prev) => ({ ...prev, amount: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Deskripsi (opsional)</span>
            <textarea
              value={formState.description}
              onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] rounded-2xl border-2 border-primary-200 px-4 py-3"
              placeholder="Contoh: Pembayaran rawat jalan poli jantung"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-full bg-accent-500 px-6 py-4 text-2xl font-semibold text-white"
            >
              Generate Snap Token Pembayaran
            </button>
          </div>
        </form>
        {message && <p className="mt-4 rounded-2xl bg-primary-100 px-4 py-3 text-primary-700">{message}</p>}
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h2 className="text-2xl font-semibold text-primary-700">Pembayaran Terakhir</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-lg">
            <thead>
              <tr className="border-b border-primary-100 text-primary-700">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Pasien</th>
                <th className="pb-3">Nominal</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-primary-50">
                  <td className="py-3">{payment.order_id}</td>
                  <td className="py-3">{payment.patient_name}</td>
                  <td className="py-3">Rp {Number(payment.amount).toLocaleString("id-ID")}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        payment.status === "PAID"
                          ? "bg-primary-100 text-primary-700"
                          : payment.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-accent-100 text-accent-500"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3">{new Date(payment.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

