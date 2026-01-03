'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardApp from "@/app/dashboardApp";

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/login", { method: "GET" });
        if (res.ok) {
          setChecked(true);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    }
    checkSession();
  }, [router]);

  if (!checked) return null;
  return <DashboardApp />;
}
