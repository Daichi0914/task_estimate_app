"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token && pathname !== "/login") {
        router.replace("/login");
      }
      if (token && pathname === "/login") {
        router.replace("/");
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}
