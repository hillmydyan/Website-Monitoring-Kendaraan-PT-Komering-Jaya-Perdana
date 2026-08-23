"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eraser, Save, CheckCircle2, PenLine, X } from "lucide-react";

export function SetSignatureCard() {
  const { currentUser, updateSignature } = useDatabase();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [sigError, setSigError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputMode, setInputMode] = useState<'draw' | 'upload'>('draw');
  const [isOpen, setIsOpen] = useState(false);
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
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
        }, 1500);
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
          setTimeout(() => {
            setIsSuccess(false);
            setIsOpen(false);
          }, 1500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline" 
        className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
      >
        <PenLine className="w-4 h-4 mr-2" />
        {currentUser?.signature ? 'Ubah Tanda Tangan' : 'Atur Tanda Tangan'}
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
            <Card className="w-full shadow-2xl border-0 ring-1 ring-slate-900/5">
              <CardHeader className="flex flex-row justify-between items-start pt-6 pb-4">
                <div>
                  <CardTitle className="text-xl text-slate-800">Pengaturan Tanda Tangan</CardTitle>
                  <CardDescription className="mt-1.5 text-sm">
                    Tanda tangan ini akan digunakan otomatis saat Anda menyetujui pengajuan.
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)} 
                  className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {currentUser?.signature && !isSuccess && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tanda Tangan Saat Ini</p>
                      <div className="bg-white border rounded-lg p-3 inline-block shadow-sm">
                        <img src={currentUser.signature} alt="Signature" className="h-16 object-contain" />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                    <h3 className="font-medium text-slate-700 text-sm">Buat Tanda Tangan Baru</h3>
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                      <Button type="button" variant={inputMode === 'draw' ? 'default' : 'ghost'} size="sm" onClick={() => { setInputMode('draw'); setSigError(""); }} className="h-8 text-xs">
                        Gambar TTD
                      </Button>
                      <Button type="button" variant={inputMode === 'upload' ? 'default' : 'ghost'} size="sm" onClick={() => { setInputMode('upload'); setSigError(""); }} className="h-8 text-xs">
                        Unggah Gambar
                      </Button>
                    </div>
                  </div>
                  
                  {inputMode === 'draw' ? (
                    <div className={`border-2 border-dashed rounded-xl relative overflow-hidden transition-colors ${sigError ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50/50"}`}>
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                          className: "w-full h-48 cursor-crosshair",
                        }}
                      />
                      <div className="absolute bottom-3 right-4 text-[10px] font-semibold tracking-wider text-slate-400 pointer-events-none select-none uppercase">
                        Tanda tangan di sini
                      </div>
                      <Button type="button" variant="outline" size="icon" onClick={clearSignature} className="absolute top-3 right-3 h-8 w-8 bg-white text-slate-500 shadow-sm rounded-full">
                        <Eraser className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${sigError ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50/50"}`}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef}
                        className="block w-full max-w-sm text-sm text-slate-500
                          file:mr-4 file:py-2.5 file:px-4
                          file:rounded-lg file:border-0
                          file:text-xs file:font-semibold
                          file:bg-blue-100 file:text-blue-700
                          hover:file:bg-blue-200 transition-colors cursor-pointer"
                      />
                      <p className="text-xs text-slate-400 mt-4 text-center">Pilih file gambar TTD Anda (PNG/JPG disarankan transparan)</p>
                    </div>
                  )}
                  {sigError && <p className="text-sm font-medium text-red-500">{sigError}</p>}
                  
                  <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                    <Button 
                      onClick={saveSignature} 
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 px-6"
                    >
                      {isSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Disimpan!
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
          </div>
        </div>
      )}
    </>
  );
}
