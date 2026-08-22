"use client";

import Link from "next/link";
import { useDatabase, DUMMY_GA_SIGNATURE } from "@/components/providers/DatabaseProvider";
import { FileText, CheckCircle, Settings, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GADashboard() {
  const { requests, updateRequestStatus } = useDatabase();

  // Tasks for GA:
  // 1. PENDING_GA_REQUEST -> fill vehicle details & auto stamp GA -> to PENDING_MANAGER_REQUEST
  // 2. PENDING_GA_INSPECTION -> review inspection & auto stamp GA -> to PENDING_MANAGER_INSPECTION

  const pendingRequests = requests.filter(r => r.status === 'PENDING_GA_REQUEST' || r.status === 'PENDING_GA_INSPECTION');
  const historyRequests = requests.filter(r => !['PENDING_GA_REQUEST', 'PENDING_GA_INSPECTION'].includes(r.status));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard General Affairs (GA)</h1>
        <p className="text-slate-500">Antrean persetujuan dan pengelolaan kendaraan operasional.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" /> Membutuhkan Tindakan
        </h2>
        <div className="grid gap-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 bg-white/50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Hore! Tidak ada antrean tugas.</p>
            </div>
          ) : (
            pendingRequests.map(req => (
              <Card key={req.id} className="p-4 border-l-4 border-l-amber-500">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">{req.employee_name} - {req.department}</h3>
                    <p className="text-sm text-slate-500">{req.purpose} | {req.use_date_start}</p>
                  </div>
                  <div className="text-sm font-medium px-3 py-1 bg-amber-100 text-amber-700 rounded-full h-fit">
                    {req.status === 'PENDING_GA_REQUEST' ? 'Tahap 1: Pengajuan' : 'Tahap 2: Pemeriksaan'}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Link 
                    href={`/pdf-preview?id=${req.id}`}
                    className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Lihat Form (PDF)
                  </Link>

                  {req.status === 'PENDING_GA_REQUEST' && (
                    <Link 
                      href={`/approval/ga/process/${req.id}`}
                      className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <Settings className="w-4 h-4" /> Proses Kendaraan & ACC
                    </Link>
                  )}

                  {req.status === 'PENDING_GA_INSPECTION' && (
                    <Button 
                      onClick={() => updateRequestStatus(req.id, 'PENDING_MANAGER_INSPECTION', { ga_inspection_signature_url: DUMMY_GA_SIGNATURE })}
                      className="bg-green-600 hover:bg-green-700 text-white h-8 text-sm"
                    >
                      <ClipboardCheck className="w-4 h-4 mr-2" /> ACC Pemeriksaan & Stamp TTD
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h2 className="text-lg font-semibold text-slate-700">Riwayat Pengajuan Terproses</h2>
        <div className="grid gap-4">
          {historyRequests.slice(0, 5).map(req => (
            <Card key={req.id} className="p-4 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-medium text-slate-700">{req.employee_name}</h3>
                  <p className="text-xs text-slate-500">Status Saat Ini: {req.status}</p>
                </div>
                <Link href={`/pdf-preview?id=${req.id}`} className="text-blue-600 text-sm hover:underline">
                  Lihat PDF
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
