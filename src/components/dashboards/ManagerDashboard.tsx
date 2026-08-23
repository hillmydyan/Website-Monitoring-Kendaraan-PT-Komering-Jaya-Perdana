"use client";

import Link from "next/link";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SetSignatureCard } from "./SetSignatureCard";

export default function ManagerDashboard() {
  const { requests, updateRequestStatus, currentUser } = useDatabase();

  // Tasks for Manager:
  // 1. PENDING_MANAGER_REQUEST -> review -> auto stamp manager -> to REQUEST_APPROVED
  // 2. PENDING_MANAGER_INSPECTION -> review -> auto stamp manager -> to FULLY_COMPLETED

  const pendingRequests = requests.filter(r => r.status === 'PENDING_MANAGER_REQUEST' || r.status === 'PENDING_MANAGER_INSPECTION');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Manager (HROGA)</h1>
          <p className="text-slate-500">Persetujuan akhir untuk pengajuan dan penyelesaian transportasi.</p>
        </div>
        <SetSignatureCard />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-500" /> Menunggu Persetujuan Final
        </h2>
        <div className="grid gap-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 bg-white/50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Semua pengajuan sudah diselesaikan.</p>
            </div>
          ) : (
            pendingRequests.map(req => (
              <Card key={req.id} className="p-4 border-l-4 border-l-indigo-500 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">{req.employee_name} - {req.department}</h3>
                    <p className="text-sm text-slate-500">{req.purpose} | Kendaraan: {req.vehicle_type || 'Belum diisi GA'}</p>
                  </div>
                  <div className="text-sm font-medium px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full h-fit">
                    {req.status === 'PENDING_MANAGER_REQUEST' ? 'Final ACC Pengajuan' : 'Final ACC Pemeriksaan'}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Link 
                    href={`/pdf-preview?id=${req.id}`}
                    target="_blank"
                    className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Buka PDF Form
                  </Link>

                  {req.status === 'PENDING_MANAGER_REQUEST' && (
                    <Button 
                      onClick={() => {
                        if (!currentUser?.signature) {
                          alert("Mohon set tanda tangan Anda terlebih dahulu di bagian atas halaman.");
                          return;
                        }
                        updateRequestStatus(req.id, 'REQUEST_APPROVED', { manager_signature_url: currentUser.signature });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> ACC Pengajuan & Stamp
                    </Button>
                  )}

                  {req.status === 'PENDING_MANAGER_INSPECTION' && (
                    <Button 
                      onClick={() => {
                        if (!currentUser?.signature) {
                          alert("Mohon set tanda tangan Anda terlebih dahulu di bagian atas halaman.");
                          return;
                        }
                        updateRequestStatus(req.id, 'FULLY_COMPLETED', { manager_inspection_signature_url: currentUser.signature });
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white h-8 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Selesaikan & Stamp (FULLY COMPLETED)
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
