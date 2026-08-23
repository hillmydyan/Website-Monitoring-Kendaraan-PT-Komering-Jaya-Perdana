"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eraser, Save, CheckCircle2 } from "lucide-react";

export function SetSignatureCard() {
  const { currentUser, updateSignature } = useDatabase();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [sigError, setSigError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputMode, setInputMode] = useState<'draw' | 'upload'>('draw');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSigError("");
    setIsSuccess(false);
  };

  const saveSignature = () => {
    if (inputMode === 'draw') {
      if (sigCanvas.current?.isEmpty()) {
        setSigError("Tanda tangan tidak boleh kosong");
        return;
      }
      
      setSigError("");
      const signatureBase64 = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
      
      if (signatureBase64) {
        updateSignature(signatureBase64);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } else {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setSigError("Pilih file gambar terlebih dahulu");
        return;
      }

      setSigError("");
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          updateSignature(result);
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg text-slate-800">Pengaturan Tanda Tangan</CardTitle>
        <CardDescription>
          Tanda tangan ini akan digunakan otomatis saat Anda menyetujui pengajuan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentUser?.signature && !isSuccess && (
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-2">Tanda Tangan Saat Ini:</p>
              <div className="bg-white border rounded-lg p-2 max-w-sm">
                <img src={currentUser.signature} alt="Signature" className="h-24 object-contain" />
              </div>
            </div>
          )}

          <div className="flex justify-between items-end">
            <h3 className="font-medium text-slate-700 text-sm">Buat Tanda Tangan Baru</h3>
            <div className="flex gap-2">
              <Button type="button" variant={inputMode === 'draw' ? 'default' : 'outline'} size="sm" onClick={() => { setInputMode('draw'); setSigError(""); }} className="h-8">
                Gambar TTD
              </Button>
              <Button type="button" variant={inputMode === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => { setInputMode('upload'); setSigError(""); }} className="h-8">
                Unggah Gambar
              </Button>
              {inputMode === 'draw' && (
                <Button type="button" variant="outline" size="sm" onClick={clearSignature} className="text-slate-500 h-8 ml-2">
                  <Eraser className="w-4 h-4 mr-2" /> Ulangi
                </Button>
              )}
            </div>
          </div>
          
          {inputMode === 'draw' ? (
            <div className={`border-2 border-dashed rounded-xl bg-slate-50/50 relative overflow-hidden transition-colors ${sigError ? "border-red-400 bg-red-50/30" : "border-slate-200"}`}>
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
          ) : (
            <div className={`border-2 border-dashed rounded-xl bg-slate-50/50 p-8 flex flex-col items-center justify-center transition-colors ${sigError ? "border-red-400 bg-red-50/30" : "border-slate-200"}`}>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                className="block w-full max-w-sm text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="text-xs text-slate-400 mt-4">Pilih file gambar TTD Anda (PNG/JPG)</p>
            </div>
          )}
          {sigError && <p className="text-sm text-red-500">{sigError}</p>}
          
          <div className="flex justify-end pt-2">
            <Button 
              onClick={saveSignature} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Berhasil Disimpan
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Simpan Tanda Tangan
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
