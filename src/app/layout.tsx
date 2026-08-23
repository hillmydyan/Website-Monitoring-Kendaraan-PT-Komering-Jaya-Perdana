import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { DatabaseProvider } from "@/components/providers/DatabaseProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monitoring Kendaraan PT Komering Jaya Perdana",
  description: "Digitalisasi pengajuan fasilitas transportasi operasional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-900 overflow-x-hidden antialiased`}>
        <DatabaseProvider>
          <ProtectedRoute>
            {/* Decorative background elements */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-100/50 via-indigo-50/20 to-transparent"></div>
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-[100px]"></div>
              <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-200/30 blur-[100px]"></div>
            </div>
            
            <Navbar />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </ProtectedRoute>
        </DatabaseProvider>
      </body>
    </html>
  );
}
