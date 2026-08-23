"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft } from "lucide-react";

export default function GAProcessPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { getRequestById, updateRequestStatus, currentUser } = useDatabase();
  const req = getRequestById(id);

  const [category, setCategory] = useState<'OPERATIONAL' | 'CONVENTIONAL' | 'ONLINE'>('OPERATIONAL');
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [requestNumber, setRequestNumber] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRequestNumber(`REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`);
  }, []);
  
  if (!req) return <div className="p-8 text-center text-red-500">Pengajuan tidak ditemukan.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.signature) {
      alert("Mohon set tanda tangan Anda terlebih dahulu di dashboard GA.");
      return;
    }
    updateRequestStatus(req.id, 'PENDING_MANAGER_REQUEST', {
      vehicle_category: category,
      vehicle_type: vehicleType,
      license_plate: licensePlate,
      request_number: requestNumber,
      ga_signature_url: currentUser.signature,
    });
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
        <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Proses Pengajuan (GA)</CardTitle>
          <CardDescription>Pilih kendaraan yang akan digunakan oleh {req.employee_name}.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Nomor Urut Permintaan</Label>
              <Input value={requestNumber} onChange={e => setRequestNumber(e.target.value)} required />
            </div>

            <div className="space-y-4">
              <Label>Kategori Kendaraan</Label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="cat" checked={category === 'OPERATIONAL'} onChange={() => setCategory('OPERATIONAL')} />
                  Kendaraan Operasional
                </label>
              </div>
            </div>

            {category === 'OPERATIONAL' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Merek/Tipe</Label>
                  <Input value={vehicleType} onChange={e => setVehicleType(e.target.value)} required placeholder="Avanza / Innova" />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Polisi</Label>
                  <Input value={licensePlate} onChange={e => setLicensePlate(e.target.value)} required placeholder="B 1234 CD" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Simpan & Berikan ACC GA (Tahap 1)
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
