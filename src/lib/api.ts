"use client";

import {
  AdminUser,
  BedAvailability,
  DoctorDashboard,
  EmergencyDashboard,
  HospitalAdminDashboard,
  NurseDashboard,
  PatientDashboard,
  PatientSummary,
  PaymentTransaction,
  ReceptionistDashboard,
  SuperAdminDashboard,
} from "@/types/dashboard";

const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const INTERNAL_API_BASE = process.env.NEXT_INTERNAL_API_URL ?? PUBLIC_API_BASE;

type PaginatedResponse<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

type UserAccount = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string;
  national_id: string;
  date_of_birth: string | null;
  gender: string;
  is_verified: boolean;
  requires_support_activation: boolean;
};

export interface RegisterPatientPayload {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  national_id?: string;
  date_of_birth?: string | null;
  gender?: string;
}

function resolveApiBase() {
  if (typeof window === "undefined") {
    return INTERNAL_API_BASE;
  }
  return PUBLIC_API_BASE;
}

function buildApiUrl(path: string) {
  return `${resolveApiBase()}${path}`;
}

function extractResults<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const headersInit = options?.headers;
  let headers: Record<string, string> = {};

  if (headersInit) {
    if (headersInit instanceof Headers) {
      // Convert Headers object to Record<string, string>
      headersInit.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(headersInit)) {
      // Convert array of tuples to Record<string, string>
      headersInit.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      // It's already a Record<string, string>
      headers = { ...headersInit };
    }
  }

  // Set Content-Type for requests with body
  if (options?.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail ?? "Terjadi kesalahan pada server.");
  }

  return (await response.json()) as T;
}

export function loginPatient(username: string, password: string) {
  return fetchJSON<{ access: string; refresh: string }>(buildApiUrl(`/auth/login/`), {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function registerPatient(payload: RegisterPatientPayload) {
  return fetchJSON<UserAccount>(buildApiUrl(`/auth/register/`), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function getAuthHeaders(accessToken?: string): Record<string, string> {
  if (!accessToken) return {};
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function fetchAuthJSON<T>(path: string, accessToken: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> || {}),
    ...getAuthHeaders(accessToken),
  };

  return fetchJSON<T>(buildApiUrl(path), {
    ...options,
    headers,
  });
}

export async function fetchBeds(accessToken: string) {
  const data = await fetchAuthJSON<BedAvailability[] | PaginatedResponse<BedAvailability>>(
    `/beds/availability/`,
    accessToken,
  );
  return extractResults<BedAvailability>(data);
}

export function fetchCurrentUser(accessToken: string) {
  return fetchAuthJSON<UserAccount>(`/users/me/`, accessToken);
}

export function fetchSuperAdminDashboard(accessToken: string) {
  return fetchAuthJSON<SuperAdminDashboard>(`/dashboard/superadmin/`, accessToken);
}

export function fetchHospitalAdminDashboard(accessToken: string) {
  return fetchAuthJSON<HospitalAdminDashboard>(`/dashboard/hospitaladmin/`, accessToken);
}

export function fetchDoctorDashboard(accessToken: string) {
  return fetchAuthJSON<DoctorDashboard>(`/dashboard/doctor/`, accessToken);
}

export function fetchReceptionistDashboard(accessToken: string) {
  return fetchAuthJSON<ReceptionistDashboard>(`/dashboard/receptionist/`, accessToken);
}

export function fetchNurseDashboard(accessToken: string) {
  return fetchAuthJSON<NurseDashboard>(`/dashboard/nurse/`, accessToken);
}

export function fetchEmergencyDashboard(accessToken: string) {
  return fetchAuthJSON<EmergencyDashboard>(`/dashboard/emergency/`, accessToken);
}

export function fetchPatientDashboard(accessToken: string) {
  return fetchAuthJSON<PatientDashboard>(`/dashboard/patient/`, accessToken);
}

export async function fetchPatients(accessToken: string) {
  const data = await fetchAuthJSON<PatientSummary[] | PaginatedResponse<PatientSummary>>(`/patients/`, accessToken);
  return extractResults<PatientSummary>(data);
}

export async function createPayment(
  accessToken: string,
  payload: { patient_id: string; amount: number; description?: string },
) {
  return fetchAuthJSON<PaymentTransaction>(`/payments/midtrans/`, accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchPayments(accessToken: string) {
  const data = await fetchAuthJSON<PaymentTransaction[] | PaginatedResponse<PaymentTransaction>>(
    `/payments/midtrans/`,
    accessToken,
  );
  return extractResults<PaymentTransaction>(data);
}

export async function fetchAdminUsers(accessToken: string) {
  const data = await fetchAuthJSON<AdminUser[] | PaginatedResponse<AdminUser>>(`/admin/users/`, accessToken);
  return extractResults<AdminUser>(data);
}

export function createAdminUser(
  accessToken: string,
  payload: Record<string, unknown>,
) {
  return fetchAuthJSON<AdminUser>(`/admin/users/`, accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminUser(
  accessToken: string,
  userId: string,
  payload: Record<string, unknown>,
) {
  return fetchAuthJSON<AdminUser>(`/admin/users/${userId}/`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function createBedAllocation(
  accessToken: string,
  payload: Record<string, unknown>,
) {
  return fetchAuthJSON<void>(`/bed-allocations/`, accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBedAllocation(
  accessToken: string,
  id: string,
  payload: Record<string, unknown>,
) {
  return fetchAuthJSON<void>(`/bed-allocations/${id}/`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  floor: number;
  department: string;
  has_elderly_support: boolean;
}

export interface Room {
  id: string;
  ward: Ward | string;
  room_number: string;
  room_type: string;
  capacity: number;
  accessibility_notes: string;
}

export interface Bed {
  id: string;
  room: string;
  bed_number: string;
  status: string;
  supports_elderly: boolean;
  equipment: Record<string, string>;
}

export async function fetchWards(accessToken: string) {
  const data = await fetchAuthJSON<Ward[] | PaginatedResponse<Ward>>(`/wards/`, accessToken);
  return extractResults<Ward>(data);
}

export async function fetchRooms(accessToken: string) {
  const data = await fetchAuthJSON<Room[] | PaginatedResponse<Room>>(`/rooms/`, accessToken);
  return extractResults<Room>(data);
}

export function createBed(accessToken: string, payload: Record<string, unknown>) {
  return fetchAuthJSON<Bed>(`/beds/`, accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createRoom(accessToken: string, payload: Record<string, unknown>) {
  return fetchAuthJSON<Room>(`/rooms/`, accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface Appointment {
  id: string;
  patient: string;
  patient_name?: string;
  doctor?: string;
  doctor_name?: string;
  appointment_type: string;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  purpose: string;
  location: string;
  notes_for_patient?: string;
}

export interface AppointmentRequestPayload {
  appointment_type: string;
  scheduled_start: string;
  scheduled_end: string;
  purpose?: string;
  location?: string;
  administration_fee: number;
}

export async function requestAppointment(accessToken: string, payload: AppointmentRequestPayload) {
  return fetchAuthJSON<Appointment>(`/appointments/request_appointment/`, accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchAppointments(accessToken: string) {
  const data = await fetchAuthJSON<Appointment[] | PaginatedResponse<Appointment>>(`/appointments/`, accessToken);
  return extractResults<Appointment>(data);
}

export function assignDoctorToAppointment(
  accessToken: string,
  appointmentId: string,
  payload: { doctor: string; location?: string; notes_for_patient?: string }
) {
  return fetchAuthJSON<Appointment>(`/appointments/${appointmentId}/assign_doctor/`, accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export async function fetchDoctors(accessToken: string) {
  const data = await fetchAuthJSON<User[] | PaginatedResponse<User>>(`/users/?role=DOCTOR`, accessToken);
  return extractResults<User>(data);
}

