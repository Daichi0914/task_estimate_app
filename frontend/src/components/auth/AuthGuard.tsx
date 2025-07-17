"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingWave from "@/components/ui/LoadingWave";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token && pathname !== "/login") {
        router.replace("/login");
      } else if (token && pathname === "/login") {
        router.replace("/");
      }
      setChecking(false);
    }
  }, [pathname, router]);

  return checking ? <LoadingWave /> : <>{children}</>
}
