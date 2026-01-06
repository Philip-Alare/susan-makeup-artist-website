'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardApp from "@/app/dashboardApp";

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Force re-login only on actual browser reload of dashboard
    try {
      const nav = (performance as any)?.getEntriesByType?.("navigation");
      const isReload = Array.isArray(nav) && nav[0]?.type === "reload";
      const cameFromDashboard = typeof document !== "undefined" && document.referrer.includes("/dashboard");
      if (isReload && cameFromDashboard) {
        fetch("/api/auth/logout", { method: "POST" }).finally(() => {
          router.replace("/login");
        });
        return;
      }
    } catch {
      /* ignore */
    }
    async function checkSession() {
      try {
        const t = Date.now();
        const res = await fetch(`/api/auth/login?t=${t}`, { method: "GET", cache: "no-store" });
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
