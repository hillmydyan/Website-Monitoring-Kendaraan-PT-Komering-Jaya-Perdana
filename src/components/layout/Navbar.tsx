"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, ShieldCheck, User, LogOut } from "lucide-react";
import { useDatabase } from "@/components/providers/DatabaseProvider";

export function Navbar() {
  const { role, currentUser, isLoggedIn, logout } = useDatabase();
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30">
              <Truck className="text-white w-5 h-5" />
            </div>
            <Link href="/" className="font-bold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              TransportPortal
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {isLoggedIn && currentUser && (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-800">{currentUser.name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                    {role === 'MANAGER' && <ShieldCheck className="w-3 h-3" />}
                    {role === 'GA_PIC' && <User className="w-3 h-3" />}
                    {role === 'EMPLOYEE' && <User className="w-3 h-3" />}
                    {role}
                  </span>
                </div>
                
                <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
                
                {role === 'ADMIN' && (
                  <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-2 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 bg-indigo-50">
                    <ShieldCheck className="w-4 h-4" /> <span className="hidden sm:inline">Admin Panel</span>
                  </Link>
                )}
                
                <button 
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 sm:px-3 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
