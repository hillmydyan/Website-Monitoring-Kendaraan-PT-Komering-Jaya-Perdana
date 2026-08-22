"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, FileCheck2, Car } from "lucide-react";

// MOCK DATA (Seolah-olah di-fetch dari Supabase berdasarkan ID)
const mockRequestData = {
  id: "req-12345",
  employee_name: "Budi Santoso",
  department: "IT Department",
  use_date_start: "2026-08-25",
  use_date_end: "2026-08-26",
  use_time_start: "08:00",
  use_time_end: "17:00",
  origin: "Kantor Pusat",
  destination: "Pabrik Cabang B",
  purpose: "Inspeksi jaringan dan maintenance server",
  status: "PENDING_GA_APPROVAL"
};

export default function GAApprovalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vehicleCategory, setVehicleCategory] = useState<"OPERATIONAL" | "CONVENTIONAL" | "ONLINE">("OPERATIONAL");
  
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      // MOCK API CALL
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("GA Approval Data:", { ...data, vehicleCategory });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-8 pb-12 pt-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="border-green-100 shadow-xl shadow-green-900/5 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-16 pb-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Approval GA Berhasil!</h2>
            <p className="text-slate-500 max-w-md">
              Data kendaraan telah disimpan dan tanda tangan digital profil Anda berhasil dibubuhkan. 
              Dokumen kini diteruskan ke Manager untuk approval akhir.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12 pt-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
          <FileCheck2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Review & Approval <span className="text-orange-600">GA</span>
          </h1>
          <p className="text-slate-500">Silakan lengkapi detail armada untuk pengajuan {mockRequestData.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: INFO PENGAJUAN */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md bg-slate-50/50">
            <CardHeader className="pb-3 border-b border-slate-200">
              <CardTitle className="text-lg">Detail Pemohon</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Nama & Divisi</p>
                <p className="font-semibold text-slate-800">{mockRequestData.employee_name}</p>
                <p className="text-sm text-slate-600">{mockRequestData.department}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Waktu Pemakaian</p>
                <p className="text-sm font-medium text-slate-800">{mockRequestData.use_date_start} s/d {mockRequestData.use_date_end}</p>
                <p className="text-sm text-slate-600">{mockRequestData.use_time_start} - {mockRequestData.use_time_end}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Rute</p>
                <p className="text-sm text-slate-800">{mockRequestData.origin} &rarr; {mockRequestData.destination}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Keperluan</p>
                <p className="text-sm text-slate-800">{mockRequestData.purpose}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: FORM INPUT GA */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-orange-200/60 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-red-500" />
            <CardHeader>
              <CardTitle>Alokasi Kendaraan (GA Section)</CardTitle>
              <CardDescription>Bagian ini akan dicetak pada form bagian hijau.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                  <Label>Nomor Urut Permintaan</Label>
                  <Input placeholder="Misal: 001/GA/VIII/2026" {...register("request_number", { required: true })} />
                </div>

                <div className="space-y-3 pt-2">
                  <Label>Kategori Transportasi</Label>
                  <div className="flex gap-4">
                    <Button type="button" variant={vehicleCategory === "OPERATIONAL" ? "default" : "outline"} onClick={() => setVehicleCategory("OPERATIONAL")} className={vehicleCategory === "OPERATIONAL" ? "bg-orange-600 hover:bg-orange-700" : ""}>
                      <Car className="w-4 h-4 mr-2" /> Operasional
                    </Button>
                    <Button type="button" variant={vehicleCategory === "CONVENTIONAL" ? "default" : "outline"} onClick={() => setVehicleCategory("CONVENTIONAL")}>Konvensional</Button>
                    <Button type="button" variant={vehicleCategory === "ONLINE" ? "default" : "outline"} onClick={() => setVehicleCategory("ONLINE")}>Online (Ojol)</Button>
                  </div>
                </div>

                {vehicleCategory === "OPERATIONAL" && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="space-y-2">
                      <Label>Merek / Tipe Kendaraan</Label>
                      <Input placeholder="Toyota Avanza" {...register("vehicle_type")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nomor Polisi</Label>
                      <Input placeholder="B 1234 CD" {...register("license_plate")} />
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800">Inspeksi Awal (Odometer & BBM Sebelum)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Odometer Awal (KM)</Label>
                      <Input type="number" placeholder="15000" {...register("odometer_start")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Posisi BBM Awal</Label>
                      <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register("fuel_level_start")}>
                        <option value="E">Empty (E)</option>
                        <option value="1/4">1/4</option>
                        <option value="1/2">1/2</option>
                        <option value="3/4">3/4</option>
                        <option value="F">Full (F)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Kondisi Kendaraan Awal</Label>
                    <Textarea placeholder="Baik, baret sedikit di bemper kiri..." {...register("vehicle_condition_start")} />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-slate-50 border-t p-6 flex justify-between items-center">
                <p className="text-sm text-slate-500 italic">
                  *Tanda tangan Anda akan otomatis dibubuhkan setelah klik Approve.
                </p>
                <Button 
                  type="submit" 
                  className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/30 px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck2 className="mr-2 h-4 w-4" />}
                  Approve (GA)
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
