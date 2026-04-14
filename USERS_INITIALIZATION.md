# 📚 User Collection Initialization Guide

Panduan lengkap untuk menginisialisasi dan mengelola user collection di Firestore untuk FirantaStore.

---

## 📋 Daftar Isi

1. [Quick Start](#quick-start)
2. [Sample Users](#sample-users)
3. [Setup Methods](#setup-methods)
4. [API Endpoints](#api-endpoints)
5. [Firestore Security Rules](#firestore-security-rules)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Metode 1: Via UI (Recommended untuk Development)

**Langkah-langkah:**

1. **Buka Initialize Page:**
   ```
   http://localhost:5173/admin/init-firestore
   ```

2. **Buat Firebase Users:**
   - Buka [Firebase Console](https://console.firebase.google.com)
   - Navigate ke "Authentication" → "Users"
   - Klik "Add User"
   - Isi email dan password untuk setiap user
   - **PENTING:** Copy UID setelah user dibuat

3. **Input UIDs ke Form:**
   - Scroll ke section "Initialize Users Collection"
   - Paste UID di form field sesuai user
   - Klik "Initialize Users"

4. **Verifikasi:**
   - Cek Firestore Console
   - Collection "users" seharusnya ada dengan dokumen baru

---

### Metode 2: Via Backend API

**Endpoint:**
```bash
POST http://localhost:3001/api/admin/users
```

**Request Body:**
```json
{
  "uid": "firebase_uid_here",
  "email": "user@example.com",
  "name": "User Name",
  "phone": "+62812345678",
  "company": "Company Name",
  "city": "Jakarta",
  "address": "Jl. Merdeka No. 123",
  "country": "Indonesia",
  "role": "user",
  "isActive": true
}
```

**Headers:**
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

**Example cURL:**
```bash
curl -X POST http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user123",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+62812345678",
    "company": "PT Example"
  }'
```

---

## 👥 Sample Users

Collection initialization dilengkapi dengan 4 sample users untuk testing:

| No. | Email | Name | Company | Role |
|-----|-------|------|---------|------|
| 1 | user1@example.com | Budi Santoso | PT Maju Jaya | user |
| 2 | user2@example.com | Siti Nurhaliza | CV Kreativ Studio | user |
| 3 | user3@example.com | Ahmad Hidayat | Design House Indonesia | user |
| 4 | vendor1@example.com | Vendor Premium | PT Vendor Mitra | vendor |

### User Fields

Setiap user document memiliki struktur:

```typescript
interface UserDocument {
  uid: string;                    // Firebase Auth UID (document ID)
  email: string;                  // User email
  name: string;                   // Full name
  phone?: string;                 // Phone number
  company?: string;               // Company name
  avatar?: string;                // Avatar URL
  city?: string;                  // City
  address?: string;               // Street address
  country?: string;               // Country
  role?: "user" | "admin" | "vendor";  // User role
  isActive?: boolean;             // Active status
  createdAt: Timestamp;           // Created timestamp
  updatedAt: Timestamp;           // Last updated timestamp
}
```

---

## 🛠️ Setup Methods

### A. Menggunakan Frontend UI

**File:** `src/pages/InitializeFirestore.tsx`

**Fitur:**
- ✅ Preview sample users
- ✅ Input multiple UIDs
- ✅ Real-time validation
- ✅ Status feedback
- ✅ Error handling

**Location:** `/admin/init-firestore`

---

### B. Menggunakan Backend API

**File:** `backend/src/index.ts`

**User Management Endpoints:**

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/users` | Admin | Get all users with filter |
| GET | `/api/admin/users/:id` | Admin | Get single user |
| POST | `/api/admin/users` | Admin | Create/update user doc |
| PUT | `/api/admin/users/:id` | Admin | Update user fields |
| DELETE | `/api/admin/users/:id` | Admin | Delete user document |
| POST | `/api/admin/users/:id/set-admin` | Admin | Set admin claim |

**Response Format:**

```json
{
  "success": true,
  "uid": "user_id",
  "message": "Operation successful"
}
```

---

### C. Menggunakan Cloud Functions (Production)

**Recommended untuk production setup:**

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createUserDocument = functions.auth.user().onCreate(async (user) => {
  const userData = {
    uid: user.uid,
    email: user.email || '',
    name: user.displayName || '',
    avatar: user.photoURL || '',
    role: 'user',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await admin.firestore().collection('users').doc(user.uid).set(userData);
});
```

---

## 📡 API Endpoints

### Get All Users

```bash
GET /api/admin/users?role=user&limit=50&offset=0&search=john
```

**Query Parameters:**
- `role` - Filter by role (user, admin, vendor, all)
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)
- `search` - Search by email or name

**Response:**
```json
{
  "users": [
    {
      "id": "uid123",
      "uid": "uid123",
      "email": "user@example.com",
      "name": "User Name",
      "phone": "+62812345678",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

---

### Create/Update User

```bash
POST /api/admin/users
```

**Body:**
```json
{
  "uid": "firebase_uid",
  "email": "user@example.com",
  "name": "User Name",
  "phone": "+62812345678",
  "company": "Company",
  "city": "Jakarta",
  "address": "Jl. Merdeka",
  "country": "Indonesia",
  "role": "user",
  "isActive": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "uid": "firebase_uid",
  "message": "User document created/updated"
}
```

---

### Update User Fields

```bash
PUT /api/admin/users/uid123
```

**Body:** (Update specific fields)
```json
{
  "name": "Updated Name",
  "phone": "+62898765432",
  "isActive": false
}
```

---

### Delete User Document

```bash
DELETE /api/admin/users/uid123
```

**Response:**
```json
{
  "success": true,
  "id": "uid123",
  "message": "User document deleted from Firestore..."
}
```

---

### Set Admin Claim

```bash
POST /api/admin/users/uid123/set-admin
```

**Body:**
```json
{
  "isAdmin": true
}
```

**Response:**
```json
{
  "success": true,
  "id": "uid123",
  "isAdmin": true,
  "message": "Admin claim updated"
}
```

---

## 🔒 Firestore Security Rules

**File:** `firestore.rules`

### User Collection Rules

```javascript
match /users/{uid} {
  // Anyone can read their own profile
  allow read: if request.auth.uid == uid;
  
  // Admins can read all user profiles
  allow read: if isAdmin();
  
  // Users can only update their own profile
  allow write: if request.auth.uid == uid;
  
  // Admins can write any user profile
  allow write: if isAdmin();
}
```

### Helper Functions

```javascript
function isSignedIn() {
  return request.auth != null;
}

function isAdmin() {
  return request.auth.token.isAdmin == true;
}

function isOwner(uid) {
  return request.auth.uid == uid;
}
```

---

## 🧪 Testing

### Test di Firebase Console

1. **Buka Firestore Console:**
   - Firebase Project Settings → Firestore
   - Navigate ke collection "users"

2. **Buat Document Manually:**
   - Click "Add Document"
   - Collection: `users`
   - Document ID: `firebase_uid`
   - Fields: Sesuai UserDocument interface

3. **Verifikasi Rules:**
   - Coba akses dengan authenticated user
   - Coba akses dengan admin user
   - Coba akses dengan unauthenticated user

### Test di JavaScript Console

```javascript
// Get current user
firebase.auth().currentUser
// Output: User object dengan uid

// Ambil UID
const uid = firebase.auth().currentUser.uid;

// Query user document
firebase.firestore()
  .collection('users')
  .doc(uid)
  .get()
  .then(doc => console.log(doc.data()));
```

---

## ❌ Troubleshooting

### Error: "Missing or insufficient permissions"

**Penyebab:**
- Firestore rules belum dipublish
- User belum punya dokumen di Firestore
- Security rules terlalu ketat

**Solusi:**
1. Verify Firestore rules dipublish
2. Buat user document via `/api/admin/users`
3. Cek security rules di Firebase Console

---

### Error: "Permission denied"

**Penyebab:**
- User tidak admin tapi akses admin endpoint
- Token expired

**Solusi:**
1. Set admin claim via `/api/admin/users/:id/set-admin`
2. Refresh page dan re-login
3. Verify custom claim di Firebase Console

---

### User Document Kosong

**Penyebab:**
- Initialize belum dijalankan
- UID tidak sesuai dengan Firebase Auth user

**Solusi:**
1. Jalankan initialize via UI
2. Verify UID match dengan Firebase Auth
3. Check console logs untuk error details

---

### Cannot Set Admin Claim

**Penyebab:**
- Service account tidak punya permission
- Backend Firebase initialization gagal

**Solusi:**
1. Check `FIREBASE_SERVICE_ACCOUNT` env variable
2. Verify service account punya admin role
3. Cek backend console logs

---

## 📝 File Structure

```
src/
├── lib/
│   ├── initializeUsers.ts        # Main initialization logic
│   ├── firebase.ts               # Firebase config
│   └── firebaseService.ts        # User CRUD functions
├── pages/
│   └── InitializeFirestore.tsx    # Initialize UI page
├── context/
│   └── UserContext.tsx           # User state management
└── App.tsx                       # Routes including /admin/init-firestore

backend/
└── src/
    └── index.ts                  # User management API endpoints

firestore.rules                   # Security rules for users collection
```

---

## 🚀 Next Steps

1. **Setup Development Users:**
   - Jalankan initialize via UI
   - Verify users muncul di Firestore

2. **Test User Authentication:**
   - Login dengan sample user
   - Verify user context updated
   - Check localStorage

3. **Setup Admin User:**
   - Create admin user di Firebase Auth
   - Set custom claim via API
   - Test admin access ke admin panel

4. **Deploy to Production:**
   - Setup Cloud Functions untuk auto-create users
   - Configure environment variables
   - Publish secure Firestore rules
   - Test dengan real users

---

## 📚 Related Documentation

- [ADMIN_SETUP.md](ADMIN_SETUP.md) - Admin panel setup
- [ADMIN_QUICK_SETUP.md](ADMIN_QUICK_SETUP.md) - Quick admin setup
- [firestore.rules](firestore.rules) - Security rules
- [BACKEND_SETUP.md](BACKEND_SETUP.md) - Backend configuration

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0
