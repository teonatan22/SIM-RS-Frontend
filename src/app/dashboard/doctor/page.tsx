"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  assignDoctorToAppointment,
  createBedAllocation,
  fetchAppointments,
  fetchBeds,
  fetchDoctorDashboard,
  fetchDoctors,
  fetchPatients,
  type Appointment,
  type User,
} from "@/lib/api";
import { getAccessToken, getUserRole } from "@/lib/auth";
import { BedAvailability, DoctorDashboard, PatientSummary } from "@/types/dashboard";

export default function DoctorDashboardPage() {
  const [data, setData] = useState<DoctorDashboard | null>(null);
  const [beds, setBeds] = useState<BedAvailability[]>([]);
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [assignFormState, setAssignFormState] = useState<Record<string, { doctor: string; location: string; notes: string }>>({});
  const [formState, setFormState] = useState({
    bed: "",
    patient: "",
    admitted_at: "",
    notes: "",
  });
  const userRole = getUserRole();
  const isMedicalDirector = userRole === "MEDICAL_DIRECTOR";

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    fetchDoctorDashboard(token)
      .then(setData)
      .catch(() => setMessage("Gagal memuat dashboard dokter."));
    fetchBeds(token)
      .then((response) => setBeds(response))
      .catch(() => setMessage("Gagal memuat ketersediaan bed."));
    fetchPatients(token)
      .then((response) => setPatients(response))
      .catch(() => setMessage("Gagal memuat daftar pasien."));
    
    // Load pending appointments and doctors for Medical Director
    if (isMedicalDirector) {
      fetchAppointments(token)
        .then((allAppointments) => {
          const pending = allAppointments.filter((apt) => apt.status === "PENDING");
          setPendingAppointments(pending);
        })
        .catch(() => setMessage("Gagal memuat daftar appointment."));
      fetchDoctors(token)
        .then(setDoctors)
        .catch(() => setMessage("Gagal memuat daftar dokter."));
    }
  }, [isMedicalDirector]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    try {
      await createBedAllocation(token, {
        bed: formState.bed,
        patient: formState.patient,
        admitted_at: formState.admitted_at,
        notes: formState.notes,
      });
      setMessage("Booking tempat tidur berhasil.");
      const refreshed = await fetchDoctorDashboard(token);
      setData(refreshed);
      const availableBeds = await fetchBeds(token);
      setBeds(availableBeds);
      setFormState({ bed: "", patient: "", admitted_at: "", notes: "" });
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const handleAssignDoctor = async (appointmentId: string) => {
    const token = getAccessToken();
    if (!token) return;
    const formData = assignFormState[appointmentId];
    if (!formData || !formData.doctor) {
      setMessage("Pilih dokter terlebih dahulu.");
      return;
    }
    try {
      await assignDoctorToAppointment(token, appointmentId, {
        doctor: formData.doctor,
        location: formData.location || undefined,
        notes_for_patient: formData.notes || undefined,
      });
      setMessage("Dokter berhasil ditetapkan ke appointment.");
      // Refresh data
      const refreshed = await fetchAppointments(token);
      const pending = refreshed.filter((apt) => apt.status === "PENDING");
      setPendingAppointments(pending);
      const refreshedDashboard = await fetchDoctorDashboard(token);
      setData(refreshedDashboard);
      // Clear form
      setAssignFormState((prev) => {
        const newState = { ...prev };
        delete newState[appointmentId];
        return newState;
      });
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h1 className="text-3xl font-semibold text-primary-700">Dashboard Dokter</h1>
        {data ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-calm p-6">
              <h2 className="text-2xl font-semibold text-primary-700">Janji Temu Mendatang</h2>
              <ul className="mt-4 space-y-3 text-lg">
                {data.upcoming_appointments.map((appointment) => (
                  <li key={appointment.id} className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="font-semibold">{appointment.patient}</p>
                    <p>{new Date(appointment.start).toLocaleString()}</p>
                    <p className="text-sm text-elderText/70">{appointment.location}</p>
                    <span className="text-sm uppercase text-primary-700">{appointment.status}</span>
                  </li>
                ))}
                {data.upcoming_appointments.length === 0 && <li>Tidak ada jadwal baru.</li>}
              </ul>
            </div>
            <div className="rounded-3xl bg-calm p-6">
              <h2 className="text-2xl font-semibold text-primary-700">Bed dalam Pengawasan</h2>
              <ul className="mt-4 space-y-3 text-lg">
                {data.active_bed_allocations.map((alloc) => (
                  <li key={alloc.allocation_id} className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="font-semibold">{alloc.patient}</p>
                    <p>
                      {alloc.ward} • Ruang {alloc.room} • Bed {alloc.bed}
                    </p>
                    <p className="text-sm text-elderText/70">
                      Status Bed: <span className="font-semibold">{alloc.status}</span>
                    </p>
                  </li>
                ))}
                {data.active_bed_allocations.length === 0 && <li>Belum ada bed yang dipesan.</li>}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-lg">Memuat data...</p>
        )}
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-comfort">
        <h2 className="text-2xl font-semibold text-primary-700">Booking Tempat Tidur Pasien</h2>
        <p className="mt-2 text-lg text-elderText/80">
          Pilih pasien dan tempat tidur yang tersedia untuk memastikan ketersediaan kamar sebelum pasien masuk.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2 text-lg">
          <label className="flex flex-col gap-2">
            <span>Pasien</span>
            <select
              value={formState.patient}
              onChange={(e) => setFormState((prev) => ({ ...prev, patient: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            >
              <option value="">Pilih pasien</option>
              {patients.map((patient) => {
                const name = patient.user_full_name || patient.user || "Pasien";
                return (
                  <option key={patient.id} value={patient.id}>
                    {name} • {patient.medical_record_number}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>Tempat Tidur</span>
            <select
              value={formState.bed}
              onChange={(e) => setFormState((prev) => ({ ...prev, bed: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            >
              <option value="">Pilih bed tersedia</option>
              {beds.map((bed) => (
                <option key={bed.id} value={bed.id}>
                  {bed.room.ward.name} • Ruang {bed.room.room_number} • Bed {bed.bed_number}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>Waktu Masuk (Admitted At)</span>
            <input
              type="datetime-local"
              value={formState.admitted_at}
              onChange={(e) => setFormState((prev) => ({ ...prev, admitted_at: e.target.value }))}
              className="rounded-2xl border-2 border-primary-200 px-4 py-3"
              required
            />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span>Catatan</span>
            <textarea
              value={formState.notes}
              onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
              className="min-h-[100px] rounded-2xl border-2 border-primary-200 px-4 py-3"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-full bg-primary-500 px-6 py-4 text-2xl font-semibold text-white"
            >
              Booking Tempat Tidur
            </button>
          </div>
        </form>
        {message && <p className="mt-4 rounded-2xl bg-primary-100 px-4 py-3 text-primary-700">{message}</p>}
      </section>

      {isMedicalDirector && (
        <section className="rounded-3xl bg-white p-8 shadow-comfort">
          <h2 className="text-2xl font-semibold text-primary-700">Tetapkan Dokter ke Appointment</h2>
          <p className="mt-2 text-lg text-elderText/80">
            Tetapkan dokter untuk appointment yang menunggu. Pastikan biaya administrasi sudah dibayar.
          </p>
          {pendingAppointments.length > 0 ? (
            <div className="mt-6 space-y-4">
              {pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl bg-calm p-6">
                  <div className="grid gap-4 md:grid-cols-2 text-lg">
                    <div>
                      <p className="text-sm text-elderText/70">Pasien</p>
                      <p className="font-semibold text-primary-700">{appointment.patient_name || appointment.patient}</p>
                    </div>
                    <div>
                      <p className="text-sm text-elderText/70">Jenis</p>
                      <p className="font-semibold text-primary-700">{appointment.appointment_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-elderText/70">Waktu Mulai</p>
                      <p className="font-semibold text-primary-700">
                        {new Date(appointment.scheduled_start).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-elderText/70">Tujuan</p>
                      <p className="font-semibold text-primary-700">{appointment.purpose || "-"}</p>
                    </div>
                    <label className="flex flex-col gap-2 md:col-span-2">
                      <span>Pilih Dokter</span>
                      <select
                        value={assignFormState[appointment.id]?.doctor || ""}
                        onChange={(e) =>
                          setAssignFormState((prev) => ({
                            ...prev,
                            [appointment.id]: {
                              ...prev[appointment.id],
                              doctor: e.target.value,
                              location: prev[appointment.id]?.location || "",
                              notes: prev[appointment.id]?.notes || "",
                            },
                          }))
                        }
                        className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                        required
                      >
                        <option value="">Pilih dokter</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.first_name
                              ? `${doctor.first_name} ${doctor.last_name || ""}`.trim()
                              : doctor.username}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-2">
                      <span>Lokasi</span>
                      <input
                        value={assignFormState[appointment.id]?.location || ""}
                        onChange={(e) =>
                          setAssignFormState((prev) => ({
                            ...prev,
                            [appointment.id]: {
                              ...prev[appointment.id],
                              doctor: prev[appointment.id]?.doctor || "",
                              location: e.target.value,
                              notes: prev[appointment.id]?.notes || "",
                            },
                          }))
                        }
                        className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                        placeholder="Contoh: Poli Umum"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span>Catatan untuk Pasien</span>
                      <input
                        value={assignFormState[appointment.id]?.notes || ""}
                        onChange={(e) =>
                          setAssignFormState((prev) => ({
                            ...prev,
                            [appointment.id]: {
                              ...prev[appointment.id],
                              doctor: prev[appointment.id]?.doctor || "",
                              location: prev[appointment.id]?.location || "",
                              notes: e.target.value,
                            },
                          }))
                        }
                        className="rounded-2xl border-2 border-primary-200 px-4 py-3"
                        placeholder="Catatan opsional"
                      />
                    </label>
                    <div className="md:col-span-2">
                      <button
                        onClick={() => handleAssignDoctor(appointment.id)}
                        className="w-full rounded-full bg-primary-500 px-6 py-3 text-lg font-semibold text-white"
                      >
                        Tetapkan Dokter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-lg text-elderText/70">Tidak ada appointment yang menunggu penugasan dokter.</p>
          )}
        </section>
      )}
    </div>
  );
}

