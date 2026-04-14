import { useState } from "react";
import { motion } from "framer-motion";
import { initializeFirestoreCollections } from "@/lib/initializeFirestore";
import {
  initializeUsersCollection,
  checkUsersCollection,
  getSampleUsers,
  generateSetupInstructions,
  addUserDocument,
} from "@/lib/initializeUsers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const InitializeFirestore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // User collection state
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersStatus, setUsersStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [usersMessage, setUsersMessage] = useState("");
  const [userUIDs, setUserUIDs] = useState<string[]>(["", "", "", ""]);
  const [showInstructions, setShowInstructions] = useState(false);
  const sampleUsers = getSampleUsers();

  const handleInitialize = async () => {
    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      await initializeFirestoreCollections();
      setStatus("success");
      setMessage(
        "✅ Firestore collections berhasil diinisialisasi! Collections yang dibuat: categories, templates, users, orders, ratings, cart"
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeUsers = async () => {
    setUsersLoading(true);
    setUsersStatus("idle");
    setUsersMessage("");

    try {
      // Filter out empty UIDs
      const nonEmptyUIDs = userUIDs
        .map((uid, index) => ({ uid: uid.trim(), index }))
        .filter((item) => item.uid.length > 0);

      if (nonEmptyUIDs.length === 0) {
        setUsersStatus("error");
        setUsersMessage("❌ Masukkan minimal satu UID user");
        setUsersLoading(false);
        return;
      }

      // Map to sample users
      const userMappings = nonEmptyUIDs.map((item, i) => ({
        sampleIndex: i,
        uid: item.uid,
      }));

      const result = await initializeUsersCollection(userMappings);

      if (result.success) {
        setUsersStatus("success");
        setUsersMessage(
          `✅ ${result.addedCount} user documents berhasil dibuat!\n\n${result.details.join("\n")}`
        );
      } else {
        setUsersStatus("error");
        setUsersMessage(
          `⚠️ ${result.addedCount} users berhasil, ${result.errors.length} error:\n\n${[...result.details, ...result.errors].join("\n")}`
        );
      }
    } catch (error) {
      setUsersStatus("error");
      setUsersMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCheckUsers = async () => {
    try {
      const result = await checkUsersCollection();
      setUsersMessage(result.message);
      setUsersStatus(result.exists ? "success" : "error");
    } catch (error) {
      setUsersMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`
      );
      setUsersStatus("error");
    }
  };

  const handleUIDChange = (index: number, value: string) => {
    const newUIDs = [...userUIDs];
    newUIDs[index] = value;
    setUserUIDs(newUIDs);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Initialize Firestore Collections
            </h1>
            <p className="text-muted-foreground text-lg">
              Inisialisasi collections di Firestore dengan data awal
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-8 glow-border"
          >
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h2 className="font-semibold text-foreground mb-4">
                  Collections yang akan dibuat:
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> categories (4
                    kategori: wedding, portfolio, birthday, anniversary)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> templates (4
                    template sample)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> users (empty)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> orders (empty)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> ratings (empty)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> cart (empty)
                  </li>
                </ul>
              </div>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                >
                  <p className="text-green-600 text-sm whitespace-pre-wrap">
                    {message}
                  </p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                >
                  <p className="text-red-600 text-sm">{message}</p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInitialize}
                disabled={isLoading || status === "success"}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Initializing..."
                  : status === "success"
                    ? "✅ Initialized"
                    : "Initialize Firestore"}
              </motion.button>

              <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
                <p>
                  ⚠️ Jalankan sekali saja. Jika collections sudah ada, akan
                  dilompati.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Users Collection Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 glass rounded-2xl p-8 glow-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Initialize Users Collection
            </h2>

            <div className="space-y-6">
              {/* Instructions Button */}
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full text-left p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/15 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-600">
                    📖 Lihat Setup Instructions
                  </span>
                  <span className="text-lg">
                    {showInstructions ? "▼" : "▶"}
                  </span>
                </div>
              </button>

              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 overflow-auto max-h-96"
                >
                  <pre className="text-xs whitespace-pre-wrap font-mono text-foreground">
                    {generateSetupInstructions()}
                  </pre>
                </motion.div>
              )}

              {/* Sample Users Preview */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Sample Users yang akan dibuat:
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {sampleUsers.map((user) => (
                    <div
                      key={user.index}
                      className="p-3 bg-background rounded border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {user.company} • {user.role}
                          </p>
                        </div>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          User {user.index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* UID Input Form */}
              <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-foreground">
                  📋 Masukkan Firebase User IDs (UIDs)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Buat {sampleUsers.length} users di Firebase Authentication
                  terlebih dahulu, kemudian copy UID mereka di bawah ini.
                </p>

                <div className="space-y-3">
                  {userUIDs.map((uid, index) => (
                    <div key={index}>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        User {index + 1}: {sampleUsers[index]?.email}
                      </label>
                      <Input
                        type="text"
                        placeholder="Paste Firebase UID here"
                        value={uid}
                        onChange={(e) => handleUIDChange(index, e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Messages */}
              {usersStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                >
                  <p className="text-green-600 text-sm whitespace-pre-wrap font-mono">
                    {usersMessage}
                  </p>
                </motion.div>
              )}

              {usersStatus === "error" && usersMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                >
                  <p className="text-red-600 text-sm whitespace-pre-wrap font-mono">
                    {usersMessage}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCheckUsers}
                  className="flex-1 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-foreground font-semibold hover:opacity-80 transition-all duration-300"
                >
                  🔍 Check Users Collection
                </button>
                <button
                  onClick={handleInitializeUsers}
                  disabled={usersLoading || usersStatus === "success"}
                  className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {usersLoading
                    ? "Initializing..."
                    : usersStatus === "success"
                      ? "✅ Initialized"
                      : "Initialize Users"}
                </button>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
                <p>
                  💡 Pastikan UIDs valid dan Firestore rules sudah mengizinkan
                  write ke collection 'users'
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InitializeFirestore;
