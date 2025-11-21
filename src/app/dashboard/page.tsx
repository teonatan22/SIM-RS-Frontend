"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getDashboardPath, getUserRole } from "@/lib/auth";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();
    router.replace(getDashboardPath(role));
  }, [router]);

  return <div>Memuat dashboard...</div>;
}

