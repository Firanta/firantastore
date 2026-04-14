import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Key, ShieldAlert } from "lucide-react";
import { auth } from "@/lib/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessageType("error");
      setMessage("Semua field harus diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("Password baru tidak cocok");
      return;
    }

    if (newPassword.length < 6) {
      setMessageType("error");
      setMessage("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("User tidak terautentikasi");
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setMessageType("success");
      setMessage("Password berhasil diubah");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessageType("error");
      if (error.code === "auth/wrong-password") {
        setMessage("Password lama salah");
      } else if (error.code === "auth/weak-password") {
        setMessage("Password terlalu lemah");
      } else {
        setMessage(error.message || "Gagal mengubah password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Admin</h1>
          <p className="text-gray-600 mt-1">Kelola pengaturan akun dan sistem</p>
        </div>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key size={20} />
              Ubah Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleChangePassword} className="space-y-4">
              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    messageType === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Lama
                </label>
                <Input
                  type="password"
                  placeholder="Masukkan password lama"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <Input
                  type="password"
                  placeholder="Masukkan password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password Baru
                </label>
                <Input
                  type="password"
                  placeholder="Konfirmasi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Mengubah..." : "Ubah Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon size={20} />
              Informasi Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Admin Panel Version</p>
                <p className="font-semibold text-gray-900">1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Firebase Status</p>
                <p className="font-semibold text-green-600">Connected</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Environment</p>
                <p className="font-semibold text-gray-900">Production</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <ShieldAlert size={20} />
              Zona Berbahaya
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-red-700">
              Tindakan berikut tidak dapat dibatalkan. Mohon bertindak dengan hati-hati.
            </p>
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              disabled
            >
              Hapus Semua Data (Non-aktif)
            </Button>
            <p className="text-xs text-red-600">
              * Fitur ini hanya tersedia untuk superadmin
            </p>
          </CardContent>
        </Card>

        {/* Backup & Export */}
        <Card>
          <CardHeader>
            <CardTitle>Backup & Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-gray-600 hover:bg-gray-700" disabled>
              Export Data Pesanan (CSV)
            </Button>
            <Button className="w-full bg-gray-600 hover:bg-gray-700" disabled>
              Export Data Template (JSON)
            </Button>
            <p className="text-xs text-gray-600">
              * Fitur export akan diaktifkan dalam versi mendatang
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
