"use client";

const ACCESS_TOKEN_KEY = "simrs_access_token";
const REFRESH_TOKEN_KEY = "simrs_refresh_token";
const USER_ROLE_KEY = "simrs_user_role";

export function saveAuthTokens(access: string, refresh: string, role: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  localStorage.setItem(USER_ROLE_KEY, role);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUserRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ROLE_KEY);
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
}

export function getDashboardPath(role: string | null) {
  if (!role) return "/auth/login";
  const mapping: Record<string, string> = {
    SUPER_ADMIN: "/dashboard/superadmin",
    HOSPITAL_ADMIN: "/dashboard/hospitaladmin",
    MEDICAL_DIRECTOR: "/dashboard/doctor", // Medical Director uses doctor dashboard
    DOCTOR: "/dashboard/doctor",
    NURSE: "/dashboard/nurse",
    MIDWIFE: "/dashboard/nurse",
    PHARMACIST: "/dashboard/receptionist", // Pharmacist uses receptionist dashboard for now
    LAB_TECH: "/dashboard/receptionist", // Lab Tech uses receptionist dashboard for now
    RADIOLOGY: "/dashboard/receptionist", // Radiology uses receptionist dashboard for now
    FINANCE: "/dashboard/receptionist", // Finance uses receptionist dashboard
    CUSTOMER_SERVICE: "/dashboard/receptionist",
    RECEPTIONIST: "/dashboard/receptionist",
    TRIAGE: "/dashboard/emergency",
    AMBULANCE: "/dashboard/emergency",
    EMERGENCY: "/dashboard/emergency",
    CLEANING: "/dashboard/receptionist", // Cleaning uses receptionist dashboard for now
    SECURITY: "/dashboard/receptionist", // Security uses receptionist dashboard for now
    IT_SUPPORT: "/dashboard/hospitaladmin", // IT Support uses hospital admin dashboard
    PATIENT: "/dashboard/patient",
    CAREGIVER: "/dashboard/patient", // Caregiver uses patient dashboard
  };
  return mapping[role] ?? "/dashboard";
}

