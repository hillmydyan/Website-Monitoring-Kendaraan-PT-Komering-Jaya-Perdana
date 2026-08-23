"use client";

import { useState } from "react";
import { useDatabase } from "@/components/providers/DatabaseProvider";
import { Role } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle, ShieldCheck, UserPlus, Users, KeyRound } from "lucide-react";

export default function AdminPage() {
  const { requests, deleteRequest, role, users, addUser, deleteUser, changePassword } = useDatabase();
  
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("123");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<Role>("EMPLOYEE");
  const [newDept, setNewDept] = useState("");
  
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [passwordToEdit, setPasswordToEdit] = useState<string | null>(null);
  const [inlinePassword, setInlinePassword] = useState("");

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newName) return;
    
    addUser({
      username: newUsername,
      password: newPassword,
      name: newName,
      role: newRole,
      department: newDept || undefined
    });
    
    setNewUsername("");
    setNewPassword("123");
    setNewName("");
    setNewRole("EMPLOYEE");
    setNewDept("");
  };

  if (role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">Akses Ditolak</h1>
        <p className="text-slate-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Admin Panel
          </h1>
          <p className="text-slate-500">Kelola dan pantau seluruh data pengajuan transportasi.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Manajemen Pengguna (Mock DB)
          </CardTitle>
          <CardDescription>Tambah atau hapus akun pengguna sementara untuk keperluan testing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Username</Label>
              <Input value={newUsername} onChange={e => setNewUsername(e.target.value)} required placeholder="Misal: joko" className="bg-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Password</Label>
              <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Misal: 123" className="bg-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nama Lengkap</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="Misal: Joko" className="bg-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Role</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                value={newRole} onChange={e => setNewRole(e.target.value as Role)}
              >
                <option value="EMPLOYEE">Karyawan</option>
                <option value="GA_PIC">PIC GA</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Departemen</Label>
              <Input value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="Opsional" className="bg-white" />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
              <UserPlus className="w-4 h-4 mr-2" /> Tambah
            </Button>
          </form>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y">
                <tr>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Password</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Departemen</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{user.username}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 text-xs">
                        {user.password || '***'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.department || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      {passwordToEdit === user.id ? (
                        <div className="inline-flex gap-1 items-center bg-slate-50 p-1 rounded-md border border-slate-200">
                          <Input 
                            value={inlinePassword}
                            onChange={e => setInlinePassword(e.target.value)}
                            className="w-24 h-7 text-xs bg-white"
                            placeholder="Pass baru..."
                            autoFocus
                          />
                          <Button 
                            variant="default" 
                            size="sm"
                            className="h-7 text-xs px-2 bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => {
                              if (inlinePassword.trim() !== "") {
                                changePassword(user.id, inlinePassword.trim());
                              }
                              setPasswordToEdit(null);
                            }}
                          >
                            OK
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-7 text-xs px-2 text-slate-500 hover:bg-slate-200"
                            onClick={() => setPasswordToEdit(null)}
                          >
                            Batal
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-1"
                          onClick={() => {
                            setInlinePassword(user.password || "");
                            setPasswordToEdit(user.id);
                          }}
                        >
                          <KeyRound className="w-4 h-4" />
                        </Button>
                      )}
                      {user.username !== 'admin' && (
                        <>
                          {userToDelete === user.id ? (
                            <div className="inline-flex gap-1">
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => {
                                  deleteUser(user.id);
                                  setUserToDelete(null);
                                }}
                              >
                                Yakin?
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setUserToDelete(null)}
                              >
                                Batal
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setUserToDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Semua Pengajuan Kendaraan</CardTitle>
          <CardDescription>Menampilkan seluruh tiket dari database.</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Belum ada data pengajuan di database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y">
                  <tr>
                    <th className="px-4 py-3">ID Tiket</th>
                    <th className="px-4 py-3">Pemohon</th>
                    <th className="px-4 py-3">Tujuan</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{req.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{req.employee_name}</td>
                      <td className="px-4 py-3">{req.destination}</td>
                      <td className="px-4 py-3">{req.use_date_start}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {ticketToDelete === req.id ? (
                          <div className="inline-flex gap-1 justify-end">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                deleteRequest(req.id);
                                setTicketToDelete(null);
                              }}
                            >
                              Yakin Hapus?
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setTicketToDelete(null)}
                            >
                              Batal
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setTicketToDelete(req.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Hapus
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
