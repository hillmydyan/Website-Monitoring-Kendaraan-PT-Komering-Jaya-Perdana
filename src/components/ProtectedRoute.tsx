"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDatabase } from "@/components/providers/DatabaseProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAuthLoaded, role } = useDatabase();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthLoaded) return;
    
    // Allow access to /login and /portal without being logged in
    // Redirect everything else to /portal if not authenticated
    if (!isLoggedIn && pathname !== "/login" && pathname !== "/portal") {
      router.replace("/portal");
    } else if (isLoggedIn && (pathname === "/login" || pathname === "/portal")) {
      if (role === 'ADMIN') {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [isLoggedIn, isAuthLoaded, pathname, router, role]);

  // Prevent flashing content if not logged in and not on login or portal page
  if (!isAuthLoaded || (!isLoggedIn && pathname !== "/login" && pathname !== "/portal")) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
