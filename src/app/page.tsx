"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useDatabase } from "@/components/providers/DatabaseProvider";
import EmployeeDashboard from "@/components/dashboards/EmployeeDashboard";
import GADashboard from "@/components/dashboards/GADashboard";
import ManagerDashboard from "@/components/dashboards/ManagerDashboard";

export default function Home() {
  const { role } = useDatabase();
  const router = useRouter();

  useEffect(() => {
    if (role === 'ADMIN') {
      router.replace('/admin');
    }
  }, [role, router]);

  return (
    <div className="w-full">
      {role === 'EMPLOYEE' && <EmployeeDashboard />}
      {role === 'GA_PIC' && <GADashboard />}
      {role === 'MANAGER' && <ManagerDashboard />}
    </div>
  );
}
