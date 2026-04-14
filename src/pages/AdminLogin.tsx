import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    setIsLoading(true);

    try {
      const isDev = import.meta.env.DEV;
      if (isDev) console.log("[AdminLogin] Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get token to check custom claims
      if (isDev) console.log("[AdminLogin] Getting ID token result...");
      const idTokenResult = await user.getIdTokenResult(true);
      if (isDev) console.log("[AdminLogin] Token claims:", idTokenResult.claims);

      // Check if user has admin claim
      if (idTokenResult.claims.isAdmin === true) {
        if (isDev) console.log("[AdminLogin] ✅ User has admin claim, redirecting to dashboard");
        navigate("/admin/dashboard");
      } else {
        if (isDev) console.log("[AdminLogin] ❌ User is not admin, access denied");
        setError("Akun ini bukan admin. Hubungi administrator untuk mendapat akses.");
        await auth.signOut();
      }
    } catch (error: any) {
      console.error("[AdminLogin] ❌ Login error:", error);
      
      // Better error messages
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        setError("Email atau password tidak sesuai. Periksa kembali.");
      } else if (error.code === "auth/invalid-email") {
        setError("Format email tidak valid");
      } else if (error.code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan login. Coba lagi nanti.");
      } else if (error.code === "auth/user-disabled") {
        setError("Akun ini telah dinonaktifkan");
      } else {
        setError(error.message || "Login gagal. Coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">🔐 Admin Login</CardTitle>
          <p className="text-sm text-gray-600">FirantaStore Admin Panel</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Admin</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Harap tunggu..." : "Login"}
            </Button>
          </form>

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-blue-900 mb-2">Belum punya akun admin?</h3>
                <ol className="text-xs text-blue-800 space-y-1.5">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Buka Firebase Console → Authentication → Users</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Klik "Add User" → Isi email & password</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>Copy UID user tersebut</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>Setup custom claim isAdmin=true (via Firebase CLI)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">5.</span>
                    <span>Publish Firestore rules</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              💡 <strong>Quick Setup?</strong> Lihat file{" "}
              <code className="bg-amber-100 px-2 py-0.5 rounded text-xs">ADMIN_QUICK_SETUP.md</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
