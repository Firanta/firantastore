import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { translations } from "@/lib/translations";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language].auth.signin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isDev = import.meta.env.DEV;
      if (isDev) console.log("[SignIn] Attempting login for:", email);
      await login(email, password);
      
      if (isDev) console.log("[SignIn] Login successful!");
      toast({
        title: translations[language].errors.loginFailed === "Login Failed" ? "Login Successful!" : "Login Berhasil!",
        description: (language as string) === "en" ? "Welcome back to Firanta Store" : "Selamat datang kembali ke Firanta Store",
        duration: 3000,
      });
      
      // Give user a moment to see the success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("[SignIn] Error:", error);
      const errorMessage = error instanceof Error ? error.message : translations[language].errors.errorOccurred;
      
      toast({
        title: t.title,
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gradient mb-2">{t.title}</h1>
            <p className="text-muted-foreground">
              {t.subtitle}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 space-y-6 glow-border"
          >
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background border cursor-pointer"
                />
                <span className="text-muted-foreground cursor-pointer">
                  {t.rememberMe}
                </span>
              </label>
              <a href="#" className="text-primary hover:underline">
                {t.forgotPassword}
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? t.loading : t.loginButton}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  {t.divider}
                </span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full py-2.5 rounded-lg border border-border bg-background hover:bg-primary/5 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.745 12.27c0-.79-.3-1.54-.84-2.15v-2.26h-2.18c.37.83.58 1.75.58 2.72 0 3.06-2.29 5.59-5.31 5.59-1.23 0-2.38-.38-3.35-.99v3.5c1.32.49 2.74.77 4.22.77 4.57 0 8.38-3.58 8.38-8.18z" />
              </svg>
              {t.googleLogin}
            </button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8 text-muted-foreground"
          >
            {t.noAccount}{" "}
            <Link to="/signup" className="text-primary hover:underline font-semibold">
              {t.signUp}
            </Link>
          </motion.p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignIn;
