"use client";

import { PDFViewer } from '@react-pdf/renderer';
import { TransportRequestPDF } from '@/components/pdf/TransportRequestPDF';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDatabase } from '@/components/providers/DatabaseProvider';
import { TransportRequest } from '@/lib/types';

export default function PDFPreview() {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { getRequestById } = useDatabase();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="p-8 text-center">Loading PDF Viewer...</div>;

  if (!id) return <div className="p-8 text-center text-red-500">Parameter ID tidak ditemukan.</div>;

  const req = getRequestById(id);
  if (!req) return <div className="p-8 text-center text-red-500">Pengajuan tidak ditemukan di database lokal.</div>;

  // Render conditionally based on status
  // If not fully completed, don't show the inspection signatures or data yet
  const showInspection = ['PENDING_GA_INSPECTION', 'PENDING_MANAGER_INSPECTION', 'FULLY_COMPLETED'].includes(req.status);

  const pdfData = {
    ...req,
    // Hide data if we are still at request stage
    odometer_start: showInspection ? req.odometer_start : '',
    odometer_end: showInspection ? req.odometer_end : '',
    fuel_level_start: showInspection ? req.fuel_level_start : '',
    fuel_level_end: showInspection ? req.fuel_level_end : '',
    vehicle_condition_start: showInspection ? req.vehicle_condition_start : '',
    vehicle_condition_end: showInspection ? req.vehicle_condition_end : '',
    notes: showInspection ? req.notes : '',
    user_inspection_signature_url: showInspection ? req.user_inspection_signature_url : '',
    ga_inspection_signature_url: req.status === 'PENDING_MANAGER_INSPECTION' || req.status === 'FULLY_COMPLETED' ? req.ga_inspection_signature_url : '',
    manager_inspection_signature_url: req.status === 'FULLY_COMPLETED' ? req.manager_inspection_signature_url : '',
    
    // Convert undefined to empty strings to satisfy type
    vehicle_category: req.vehicle_category || '',
    vehicle_type: req.vehicle_type || '',
    license_plate: req.license_plate || '',
    ga_signature_url: req.ga_signature_url || '',
    manager_signature_url: req.manager_signature_url || '',
    request_number: req.request_number || '',
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-center text-slate-800">Preview Form ({req.status})</h1>
      <div className="flex-1 border-2 border-slate-200 rounded-xl overflow-hidden shadow-lg">
        <PDFViewer width="100%" height="100%" className="border-none">
          <TransportRequestPDF data={pdfData} />
        </PDFViewer>
      </div>
    </div>
  );
}
