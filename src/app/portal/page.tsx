"use client";

import { useRouter } from "next/navigation";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { Users, CheckSquare, ShieldCheck, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PortalPage() {
  const router = useRouter();
  const { loginAsEmployee } = useDatabase();

  const handleEmployeeLogin = () => {
    loginAsEmployee();
    router.replace("/");
  };

  const handleRoleSelection = (role: string) => {
    router.push(`/login?role=${role}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
      {/* Decorative background - fixed so it doesn't break on scroll */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-[100px]"></div>
      </div>

      <div className="min-h-full w-full flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="relative z-10 w-full max-w-5xl py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-10 md:mb-12 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/30 mb-6">
            <Truck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-4">
            Portal Transportasi
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Pilih peran Anda untuk masuk ke dalam sistem Monitoring Kendaraan PT Komering Jaya Perdana
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Employee Card */}
          <Card 
            onClick={handleEmployeeLogin}
            className="group cursor-pointer p-8 rounded-3xl border-2 border-transparent hover:border-blue-500/30 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">Pengguna</h2>
              <p className="text-slate-500">Masuk sebagai pengguna untuk mengajukan fasilitas transportasi operasional</p>
            </div>
          </Card>

          {/* GA Card */}
          <Card 
            onClick={() => handleRoleSelection('GA_PIC')}
            className="group cursor-pointer p-8 rounded-3xl border-2 border-transparent hover:border-amber-500/30 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckSquare className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">Verifikasi (GA)</h2>
              <p className="text-slate-500">Masuk sebagai General Affairs untuk memeriksa dan memverifikasi pengajuan</p>
            </div>
          </Card>

          {/* Manager Card */}
          <Card 
            onClick={() => handleRoleSelection('MANAGER')}
            className="group cursor-pointer p-8 rounded-3xl border-2 border-transparent hover:border-emerald-500/30 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">Approve</h2>
              <p className="text-slate-500">Masuk sebagai Manager Kantor untuk menyetujui atau menolak pengajuan</p>
            </div>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}
