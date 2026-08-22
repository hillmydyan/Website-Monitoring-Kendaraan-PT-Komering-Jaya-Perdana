"use client";

import Link from "next/link";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { PlusCircle, FileText, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function EmployeeDashboard() {
  const { requests } = useDatabase();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Karyawan</h1>
          <p className="text-slate-500">Kelola pengajuan fasilitas transportasi Anda.</p>
        </div>
        <Link 
          href="/request/new" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Pengajuan Baru
        </Link>
      </div>

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Belum ada pengajuan transportasi.</p>
          </div>
        ) : (
          requests.map(req => (
            <Card key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-blue-500">
              <div>
                <h3 className="font-semibold text-lg text-slate-800">{req.purpose}</h3>
                <p className="text-sm text-slate-500">
                  {req.use_date_start} | {req.origin} → {req.destination}
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    Status: <strong className="text-slate-800">{req.status}</strong>
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Link 
                  href={`/pdf-preview?id=${req.id}`}
                  className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" /> Lihat PDF
                </Link>
                
                {req.status === 'REQUEST_APPROVED' && (
                  <Link 
                    href={`/request/inspection/${req.id}`}
                    className="flex items-center gap-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4" /> Isi Pemeriksaan
                  </Link>
                )}
                
                {['PENDING_GA_REQUEST', 'PENDING_MANAGER_REQUEST', 'PENDING_GA_INSPECTION', 'PENDING_MANAGER_INSPECTION'].includes(req.status) && (
                  <span className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4" /> Menunggu Review
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
