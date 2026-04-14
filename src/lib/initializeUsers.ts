import {
  collection,
  doc,
  setDoc,
  getDocs,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Interface untuk User Document di Firestore
 */
export interface UserDocument {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  avatar?: string;
  city?: string;
  address?: string;
  country?: string;
  role?: "user" | "admin" | "vendor";
  isActive?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Sample users untuk development & testing
 */
const SAMPLE_USERS: Omit<UserDocument, "uid" | "createdAt" | "updatedAt">[] = [
  {
    email: "user1@example.com",
    name: "Budi Santoso",
    phone: "+62812345678",
    company: "PT Maju Jaya",
    city: "Jakarta",
    address: "Jl. Merdeka No. 123",
    country: "Indonesia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    role: "user",
    isActive: true,
  },
  {
    email: "user2@example.com",
    name: "Siti Nurhaliza",
    phone: "+62823456789",
    company: "CV Kreativ Studio",
    city: "Bandung",
    address: "Jl. Gatot Subroto No. 456",
    country: "Indonesia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    role: "user",
    isActive: true,
  },
  {
    email: "user3@example.com",
    name: "Ahmad Hidayat",
    phone: "+62834567890",
    company: "Design House Indonesia",
    city: "Surabaya",
    address: "Jl. Ahmad Yani No. 789",
    country: "Indonesia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    role: "user",
    isActive: true,
  },
  {
    email: "vendor1@example.com",
    name: "Vendor Premium",
    phone: "+6281999999",
    company: "PT Vendor Mitra",
    city: "Yogyakarta",
    address: "Jl. Malioboro No. 111",
    country: "Indonesia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vendor",
    role: "vendor",
    isActive: true,
  },
];

/**
 * Cek apakah collection users sudah ada dan ada dokumen
 */
export async function checkUsersCollection(): Promise<{
  exists: boolean;
  count: number;
  message: string;
}> {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    return {
      exists: true,
      count: snapshot.size,
      message:
        snapshot.size > 0
          ? `✅ Collection 'users' sudah ada dengan ${snapshot.size} dokumen`
          : `⚠️ Collection 'users' ada tapi kosong (${snapshot.size} dokumen)`,
    };
  } catch (error) {
    console.error("Error checking users collection:", error);
    return {
      exists: false,
      count: 0,
      message: "❌ Collection 'users' belum ada atau error",
    };
  }
}

/**
 * Initialize user collection dengan sample data
 * CATATAN: Gunakan UID dari actual Firebase users
 */
export async function initializeUsersCollection(
  userMappings: Array<{ sampleIndex: number; uid: string }>
): Promise<{
  success: boolean;
  addedCount: number;
  errors: string[];
  details: string[];
}> {
  const errors: string[] = [];
  const details: string[] = [];
  let addedCount = 0;

  try {
    const batch = writeBatch(db);

    for (const mapping of userMappings) {
      try {
        if (mapping.sampleIndex < 0 || mapping.sampleIndex >= SAMPLE_USERS.length) {
          errors.push(`❌ Invalid sample index: ${mapping.sampleIndex}`);
          continue;
        }

        if (!mapping.uid || mapping.uid.trim().length === 0) {
          errors.push(`❌ UID tidak valid untuk sample index ${mapping.sampleIndex}`);
          continue;
        }

        const sampleUser = SAMPLE_USERS[mapping.sampleIndex];
        const userRef = doc(db, "users", mapping.uid);

        const userDoc: UserDocument = {
          uid: mapping.uid,
          ...sampleUser,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        batch.set(userRef, userDoc);
        details.push(
          `✅ Added user: ${sampleUser.email} dengan UID: ${mapping.uid}`
        );
        addedCount++;
      } catch (error: any) {
        errors.push(
          `❌ Error untuk sample index ${mapping.sampleIndex}: ${error.message}`
        );
      }
    }

    // Commit batch
    await batch.commit();

    return {
      success: errors.length === 0,
      addedCount,
      errors,
      details,
    };
  } catch (error: any) {
    console.error("Error initializing users collection:", error);
    return {
      success: false,
      addedCount: 0,
      errors: [
        `❌ Fatal error: ${error.message}`,
        "Batch operation gagal. Periksa Firestore rules dan koneksi database.",
      ],
      details,
    };
  }
}

/**
 * Tambah single user document
 */
export async function addUserDocument(
  uid: string,
  userData: Omit<UserDocument, "uid" | "createdAt" | "updatedAt">
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (!uid || uid.trim().length === 0) {
      return {
        success: false,
        message: "❌ UID tidak boleh kosong",
      };
    }

    const userRef = doc(db, "users", uid);
    const userDoc: UserDocument = {
      uid,
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(userRef, userDoc);

    return {
      success: true,
      message: `✅ User document berhasil dibuat: ${userData.email}`,
    };
  } catch (error: any) {
    console.error("Error adding user document:", error);
    return {
      success: false,
      message: `❌ Error: ${error.message}`,
    };
  }
}

/**
 * Update user document
 */
export async function updateUserDocument(
  uid: string,
  updates: Partial<Omit<UserDocument, "uid" | "createdAt">>
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const userRef = doc(db, "users", uid);

    await setDoc(
      userRef,
      {
        ...updates,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return {
      success: true,
      message: `✅ User document berhasil diupdate`,
    };
  } catch (error: any) {
    console.error("Error updating user document:", error);
    return {
      success: false,
      message: `❌ Error: ${error.message}`,
    };
  }
}

/**
 * Dapatkan list sample users (untuk UI preview)
 */
export function getSampleUsers() {
  return SAMPLE_USERS.map((user, index) => ({
    index,
    ...user,
  }));
}

/**
 * Dapatkan data untuk copy-paste ke Firebase Console
 * Guna: Membuat users di Firebase Auth terlebih dahulu, copy UID, paste ke form
 */
export function generateSetupInstructions(): string {
  const instructions = `
🔧 SETUP INSTRUCTION: Initialize Users Collection

LANGKAH-LANGKAH:
─────────────────────────────────────────────────────────────

1️⃣ BUAT USERS DI FIREBASE AUTHENTICATION
   • Buka Firebase Console → Authentication → Add User
   • Buat ${SAMPLE_USERS.length} users dengan email berikut:
   
${SAMPLE_USERS.map((user, i) => `   ${i + 1}. ${user.email}`).join("\n")}

   • Ganti password dengan yang mudah untuk testing
   • JANGAN LUPA: Copy UID setiap user yang dibuat

2️⃣ DAPATKAN UID DARI FIREBASE CONSOLE
   • Authentication → Click user → Copy UID

3️⃣ GUNAKAN INITIALIZATION PAGE
   • Buka http://localhost:5173/initialize-firestore
   • Scroll ke section "Initialize Users Collection"
   • Paste UID setiap user sesuai mapping
   • Klik "Initialize Users"

4️⃣ VERIFIKASI
   • Buka Firestore Console
   • Lihat collection "users" 
   • Seharusnya sudah ada ${SAMPLE_USERS.length} dokumen

─────────────────────────────────────────────────────────────

SAMPLE USERS YANG AKAN DIBUAT:
${SAMPLE_USERS.map(
  (user, i) => `
${i + 1}. ${user.name} (${user.email})
   Company: ${user.company || "-"}
   Phone: ${user.phone || "-"}
   Role: ${user.role || "user"}
`
).join("")}

CATATAN:
• Firestore rules harus allow write untuk 'users' collection
• Lihat ADMIN_SETUP.md untuk detail security rules
• Untuk production, gunakan Cloud Functions untuk create user

  `.trim();

  return instructions;
}
