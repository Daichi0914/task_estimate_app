"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingWave } from "@/components/ui/LoadingWave";

const NO_AUTH_PAGES = ["/login", "/signup"];

async function checkAuth(): Promise<boolean> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  if (!token || !userId) return false;
  try {
    const res = await fetch(`/api/v1/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        if (!token || !userId) {
          if (!NO_AUTH_PAGES.includes(pathname)) router.replace("/login");
          setChecking(false);
          return;
        }
        const valid = await checkAuth();
        if (!valid) {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          router.replace("/login");
        } else if (NO_AUTH_PAGES.includes(pathname)) {
          router.replace("/");
        }
        setChecking(false);
      }
    })();
  }, [pathname, router]);

  return checking ? <LoadingWave /> : <>{children}</>;
};
