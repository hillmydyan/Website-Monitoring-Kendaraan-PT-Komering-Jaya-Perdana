"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignatureCanvas from "react-signature-canvas";
import { useRouter } from "next/navigation";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Eraser, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  employee_name: z.string().min(2, "Nama terlalu pendek"),
  department: z.string().min(2, "Departemen terlalu pendek"),
  use_date_start: z.string().min(1, "Wajib diisi"),
  use_date_end: z.string().min(1, "Wajib diisi"),
  use_time_start: z.string().min(1, "Wajib diisi"),
  use_time_end: z.string().min(1, "Wajib diisi"),
  origin: z.string().min(2, "Wajib diisi"),
  destination: z.string().min(2, "Wajib diisi"),
  purpose: z.string().min(5, "Tuliskan keperluan dengan lebih detail"),
});

type FormValues = z.infer<typeof formSchema>;

export function TransportRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [sigError, setSigError] = useState("");
  const router = useRouter();
  const { addRequest } = useDatabase();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSigError("");
  };

  const onSubmit = async (data: FormValues) => {
    if (sigCanvas.current?.isEmpty()) {
      setSigError("Tanda tangan wajib diisi");
      return;
    }
    setSigError("");
    setIsSubmitting(true);

    try {
      const signatureBase64 = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
      
      if (!signatureBase64) return;
      
      addRequest({
        ...data,
        user_signature_url: signatureBase64,
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto border-blue-100 shadow-xl shadow-blue-900/5 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-16 pb-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Pengajuan Berhasil Dikirim!</h2>
          <p className="text-slate-500 max-w-md">
            Permintaan fasilitas transportasi Anda telah dikirim dan sedang menunggu persetujuan dari pihak General Affairs (GA).
          </p>
          <Button 
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8"
            onClick={() => router.push('/')}
          >
            Kembali ke Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto border-slate-200/60 shadow-2xl shadow-blue-900/5 bg-white/90 backdrop-blur-xl overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-500" />
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl text-slate-800">Form Pengajuan Transportasi</CardTitle>
        <CardDescription className="text-slate-500 text-base">
          FRM-KM.CRP.49-01.00/0122 - Harap isi formulir ini dengan lengkap untuk mengajukan kendaraan operasional/konvensional.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8">
          {/* Bagian 1: Data Diri */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm">1</span>
              Informasi Pemohon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_name">Nama Lengkap</Label>
                <Input id="employee_name" placeholder="John Doe" {...register("employee_name")} className={errors.employee_name ? "border-red-500" : ""} />
                {errors.employee_name && <p className="text-sm text-red-500">{errors.employee_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Divisi / Departemen</Label>
                <Input id="department" placeholder="IT Development" {...register("department")} className={errors.department ? "border-red-500" : ""} />
                {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
              </div>
            </div>
          </div>
          
          <Separator className="bg-slate-100" />

          {/* Bagian 2: Waktu & Tujuan */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm">2</span>
              Detail Keberangkatan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="use_date_start">Tanggal Berangkat</Label>
                <Input type="date" id="use_date_start" {...register("use_date_start")} className={errors.use_date_start ? "border-red-500" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="use_date_end">Tanggal Kembali</Label>
                <Input type="date" id="use_date_end" {...register("use_date_end")} className={errors.use_date_end ? "border-red-500" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="use_time_start">Waktu Berangkat</Label>
                <Input type="time" id="use_time_start" {...register("use_time_start")} className={errors.use_time_start ? "border-red-500" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="use_time_end">Waktu Kembali</Label>
                <Input type="time" id="use_time_end" {...register("use_time_end")} className={errors.use_time_end ? "border-red-500" : ""} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="origin">Lokasi Asal</Label>
                <Input id="origin" placeholder="Kantor Pusat" {...register("origin")} className={errors.origin ? "border-red-500" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Lokasi Tujuan</Label>
                <Input id="destination" placeholder="Pabrik Cabang B" {...register("destination")} className={errors.destination ? "border-red-500" : ""} />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label htmlFor="purpose">Keperluan</Label>
              <Textarea id="purpose" placeholder="Inspeksi mesin produksi..." {...register("purpose")} className={`min-h-[100px] resize-none ${errors.purpose ? "border-red-500" : ""}`} />
              {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Bagian 3: Tanda Tangan */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm">3</span>
                Tanda Tangan
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="text-slate-500 h-8">
                <Eraser className="w-4 h-4 mr-2" /> Ulangi
              </Button>
            </div>
            <div className={`border-2 border-dashed rounded-xl bg-slate-50/50 relative overflow-hidden transition-colors ${sigError ? "border-red-400 bg-red-50/30" : "border-slate-200 hover:bg-slate-50 hover:border-blue-300"}`}>
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  className: "w-full h-48 cursor-crosshair",
                }}
              />
              <div className="absolute bottom-2 right-4 text-xs font-medium text-slate-400 pointer-events-none select-none">
                Tanda tangan di atas area ini
              </div>
            </div>
            {sigError && <p className="text-sm text-red-500">{sigError}</p>}
          </div>

        </CardContent>
        <CardFooter className="bg-slate-50/80 border-t border-slate-100 p-6">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 h-12 text-lg rounded-xl transition-all active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirimkan...
              </>
            ) : (
              "Kirim Pengajuan"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
