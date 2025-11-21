"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { fetchCurrentUser } from "@/lib/api";
import { clearAuth, getAccessToken, getDashboardPath, getUserRole } from "@/lib/auth";

const NAV_ITEMS: Record<string, { label: string; href: string }[]> = {
  SUPER_ADMIN: [
    { label: "Overview", href: "/dashboard/superadmin" },
    { label: "Manage Users", href: "/dashboard/superadmin" },
  ],
  HOSPITAL_ADMIN: [
    { label: "Overview", href: "/dashboard/hospitaladmin" },
    { label: "Manage Users", href: "/dashboard/hospitaladmin" },
  ],
  DOCTOR: [
    { label: "Beranda", href: "/dashboard/doctor" },
    { label: "Ketersediaan Bed", href: "/rooms" },
  ],
  CUSTOMER_SERVICE: [
    { label: "Beranda", href: "/dashboard/receptionist" },
    { label: "Aktivasi Pasien", href: "/auth/register" },
  ],
  NURSE: [{ label: "Beranda", href: "/dashboard/nurse" }],
  MIDWIFE: [{ label: "Beranda", href: "/dashboard/nurse" }],
  TRIAGE: [{ label: "IGD", href: "/dashboard/emergency" }],
  AMBULANCE: [{ label: "IGD", href: "/dashboard/emergency" }],
  EMERGENCY: [{ label: "IGD", href: "/dashboard/emergency" }],
  PATIENT: [{ label: "Beranda", href: "/dashboard/patient" }],
  MEDICAL_DIRECTOR: [
    { label: "Beranda", href: "/dashboard/doctor" },
    { label: "Ketersediaan Bed", href: "/rooms" },
  ],
  PHARMACIST: [
    { label: "Beranda", href: "/dashboard/receptionist" },
  ],
  LAB_TECH: [
    { label: "Beranda", href: "/dashboard/receptionist" },
  ],
  RADIOLOGY: [
    { label: "Beranda", href: "/dashboard/receptionist" },
  ],
  FINANCE: [
    { label: "Beranda", href: "/dashboard/receptionist" },
  ],
  CLEANING: [
    { label: "Beranda", href: "/dashboard/receptionist" },
  ],
  SECURITY: [
    { label: "Beranda", href: "/dashboard/receptionist" },
  ],
  IT_SUPPORT: [
    { label: "Overview", href: "/dashboard/hospitaladmin" },
    { label: "Manage Users", href: "/dashboard/hospitaladmin" },
  ],
  CAREGIVER: [{ label: "Beranda", href: "/dashboard/patient" }],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.replace("/auth/login");
      return;
    }
    const currentRole = getUserRole();
    setRole(currentRole);
    fetchCurrentUser(accessToken)
      .then((user) => {
        setUserName(user.first_name ? `${user.first_name} ${user.last_name ?? ""}`.trim() : user.username);
        setRole(user.role);
      })
      .catch(() => {
        clearAuth();
        router.replace("/auth/login");
      });
  }, [router]);

  const navItems = role ? NAV_ITEMS[role] ?? [] : [];

  return (
    <div className="min-h-screen bg-calm">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-3xl font-semibold text-primary-700">SIM-RS+ Dashboard</span>
          <div className="text-right">
            <p className="text-lg font-semibold text-elderText">{userName}</p>
            <p className="text-sm text-elderText/70">{role ?? "Memuat..."}</p>
            <button
              onClick={() => {
                clearAuth();
                router.replace("/auth/login");
              }}
              className="mt-2 rounded-full border border-primary-300 px-3 py-1 text-sm text-primary-700"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:flex-row">
        <nav className="w-full rounded-3xl bg-white p-6 shadow-comfort lg:w-64">
          <ul className="space-y-3 text-lg">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-2xl px-4 py-3 ${
                      active ? "bg-primary-500 text-white" : "bg-calm text-elderText hover:bg-primary-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={getDashboardPath(role)}
                className="block rounded-2xl px-4 py-3 text-elderText hover:bg-primary-100"
              >
                Dashboard Saya
              </Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

