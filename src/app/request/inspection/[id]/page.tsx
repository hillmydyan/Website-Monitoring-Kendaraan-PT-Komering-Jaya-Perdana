import { InspectionForm } from "@/components/InspectionForm";

export default async function InspectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-8 pb-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2 max-w-2xl mx-auto mb-4">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Pemeriksaan Kendaraan
        </h1>
        <p className="text-slate-500">Tahap penyelesaian pemakaian operasional</p>
      </div>

      <InspectionForm id={id} />
    </div>
  );
}
