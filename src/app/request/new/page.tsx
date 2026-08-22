import { TransportRequestForm } from "@/components/TransportRequestForm";

export default function NewRequestPage() {
  return (
    <div className="flex flex-col gap-8 pb-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-4">
        <div className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 mb-4">
          FRM-KM.CRP.49-01.00/0122
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Buat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Pengajuan Baru</span>
        </h1>
      </div>

      <TransportRequestForm />
    </div>
  );
}
