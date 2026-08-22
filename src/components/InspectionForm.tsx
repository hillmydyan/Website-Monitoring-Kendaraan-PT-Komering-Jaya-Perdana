"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useRouter } from "next/navigation";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eraser, Loader2 } from "lucide-react";

export function InspectionForm({ id }: { id: string }) {
  const { getRequestById, updateRequestStatus } = useDatabase();
  const req = getRequestById(id);
  const router = useRouter();
  
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [sigError, setSigError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States
  const [odometerStart, setOdometerStart] = useState("");
  const [odometerEnd, setOdometerEnd] = useState("");
  const [fuelStart, setFuelStart] = useState("1/2");
  const [fuelEnd, setFuelEnd] = useState("1/2");
  const [condStart, setCondStart] = useState("Baik");
  const [condEnd, setCondEnd] = useState("Baik");
  const [notes, setNotes] = useState("");

  if (!req) return <div className="text-center text-red-500">Pengajuan tidak ditemukan.</div>;

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSigError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sigCanvas.current?.isEmpty()) {
      setSigError("Tanda tangan wajib diisi");
      return;
    }
    
    setIsSubmitting(true);
    const signatureBase64 = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    
    updateRequestStatus(req.id, 'PENDING_GA_INSPECTION', {
      odometer_start: odometerStart,
      odometer_end: odometerEnd,
      fuel_level_start: fuelStart,
      fuel_level_end: fuelEnd,
      vehicle_condition_start: condStart,
      vehicle_condition_end: condEnd,
      notes: notes,
      user_inspection_signature_url: signatureBase64,
    });
    
    router.push('/');
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Form Pemeriksaan Kendaraan</CardTitle>
        <CardDescription>Harap diisi sebelum dan sesudah penggunaan kendaraan operasional.</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-semibold text-slate-800">Sebelum Pemakaian</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Odometer (KM)</Label>
                <Input value={odometerStart} onChange={e => setOdometerStart(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Posisi BBM</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={fuelStart} onChange={e => setFuelStart(e.target.value)}
                >
                  <option value="E">E</option>
                  <option value="1/4">1/4</option>
                  <option value="1/2">1/2</option>
                  <option value="3/4">3/4</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Kondisi Fisik</Label>
                <Input value={condStart} onChange={e => setCondStart(e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="font-semibold text-slate-800">Sesudah Pemakaian</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Odometer (KM)</Label>
                <Input value={odometerEnd} onChange={e => setOdometerEnd(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Posisi BBM</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  value={fuelEnd} onChange={e => setFuelEnd(e.target.value)}
                >
                  <option value="E">E</option>
                  <option value="1/4">1/4</option>
                  <option value="1/2">1/2</option>
                  <option value="3/4">3/4</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Kondisi Fisik</Label>
                <Input value={condEnd} onChange={e => setCondEnd(e.target.value)} required />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Keterangan Tambahan (Opsional)</Label>
            <Textarea 
              value={notes} onChange={e => setNotes(e.target.value)} 
              placeholder="Misal: Kendaraan menginap di site A..."
            />
          </div>

          <Separator />
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="font-semibold text-slate-900 text-lg">Tanda Tangan Pemakai (Pemeriksaan)</h3>
              <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="text-slate-500 h-8">
                <Eraser className="w-4 h-4 mr-2" /> Ulangi
              </Button>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: "w-full h-48 cursor-crosshair" }}
              />
            </div>
            {sigError && <p className="text-sm text-red-500">{sigError}</p>}
          </div>

        </CardContent>
        <CardFooter className="bg-slate-50/80 border-t p-6 flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.push('/')} className="w-1/3">
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-2/3 bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Kirim Laporan Pemeriksaan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
