"use client";

import { useState, Suspense } from "react";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { Truck, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const { login } = useDatabase();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleParam = searchParams.get('role');
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Determine role display title
  let roleTitle = "Monitoring Kendaraan PT Komering Jaya Perdana";
  let roleSubtitle = "Masuk untuk mengelola fasilitas transportasi";
  
  if (roleParam === 'GA_PIC') {
    roleTitle = "Masuk sebagai Verifikasi (GA)";
    roleSubtitle = "Gunakan akun General Affairs Anda";
  } else if (roleParam === 'MANAGER') {
    roleTitle = "Masuk sebagai Manager Kantor";
    roleSubtitle = "Gunakan akun Manager Anda";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Simulate network delay for effect
    await new Promise(r => setTimeout(r, 600));
    
    const success = login(username, password);
    if (!success) {
      setError("Username atau password salah");
      setLoading(false);
    }
    // if success, the ProtectedRoute component will automatically redirect to "/"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
      {/* Decorative background - fixed so it doesn't break on scroll */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-[100px]"></div>
      </div>

      <div className="min-h-full w-full flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-500 my-8">
          
          <button 
          onClick={() => router.push('/portal')}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/30 mb-4">
            <Truck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 text-center">
            {roleTitle}
          </h1>
          <p className="text-slate-500 text-sm mt-1 text-center">{roleSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </Button>
        </form>


        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
