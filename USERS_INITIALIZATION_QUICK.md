# ⚡ User Initialization Quick Reference

Panduan singkat untuk setup user collection.

---

## 🚀 30-Second Setup

1. Go to: `http://localhost:5173/admin/init-firestore`
2. Create users di Firebase Console → Authentication
3. Copy UIDs dan paste ke form
4. Click "Initialize Users"
5. ✅ Done!

---

## 4️⃣ Sample Users Ready to Create

| Email | Name | Role | Company |
|-------|------|------|---------|
| user1@example.com | Budi Santoso | user | PT Maju Jaya |
| user2@example.com | Siti Nurhaliza | user | CV Kreativ Studio |
| user3@example.com | Ahmad Hidayat | user | Design House |
| vendor1@example.com | Vendor Premium | vendor | PT Vendor Mitra |

---

## 📋 Where to Find Things

| What | Where |
|------|-------|
| Initialize Page | `/admin/init-firestore` |
| Create Users | Firebase Console → Authentication |
| View Users | Firebase Console → Firestore → users collection |
| User Fields | `src/lib/initializeUsers.ts` (UserDocument interface) |
| API Endpoints | `backend/src/index.ts` (lines 1000+) |
| Security Rules | `firestore.rules` |

---

## 🔌 API Quick Commands

### Get All Users
```bash
curl http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer TOKEN"
```

### Create User
```bash
curl -X POST http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "user_uid_here",
    "email": "user@example.com",
    "name": "User Name"
  }'
```

### Set Admin
```bash
curl -X POST http://localhost:3001/api/admin/users/user_uid_here/set-admin \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isAdmin": true}'
```

---

## ❓ Common Issues

| Problem | Solution |
|---------|----------|
| "Missing permissions" | Publish firestore.rules to Firebase Console |
| "User not found" | Verify UID matches Firebase Auth user |
| UID rejected in form | Paste complete UID (no spaces) |
| Users not showing | Check Firestore rules allow read access |

---

## 📁 Key Files

```
src/lib/initializeUsers.ts     # ← Core functions
src/pages/InitializeFirestore.tsx  # ← UI Page
backend/src/index.ts           # ← API endpoints
firestore.rules                # ← Security rules
```

---

## 🎯 Next: Admin User Setup

```bash
# 1. Create user in Firebase Console

# 2. Get their UID, then set admin:
curl -X POST http://localhost:3001/api/admin/users/UID/set-admin \
  -H "Authorization: Bearer TOKEN" \
  -d '{"isAdmin": true}'

# 3. User can now login to /admin/login
```

---

## 📚 Full Guide

See: [USERS_INITIALIZATION.md](USERS_INITIALIZATION.md)

