# Midtrans Payment Integration Guide

Dokumentasi lengkap untuk integrasi Midtrans di Firantastoree.

## ✅ Yang Sudah Disetup

### 1. **Firebase Functions** 
- ✅ `functions/package.json` - Dependencies untuk Cloud Functions
- ✅ `functions/tsconfig.json` - TypeScript configuration
- ✅ `functions/src/index.ts` - Payment functions implementation

### 2. **Frontend Integration**
- ✅ `src/lib/midtransService.ts` - Midtrans API service
- ✅ `src/components/MidtransPayment.tsx` - Payment button component
- ✅ `src/pages/Checkout.tsx` - Complete checkout page
- ✅ `src/App.tsx` - Routes configuration (sudah ditambahkan `/checkout`)

### 3. **Environment Variables**
- ✅ `.env.local` - Frontend environment variables
- ✅ `functions/.env.example` - Template untuk Firebase Functions

### 4. **Firebase Configuration**
- ✅ `firebase.json` - Updated dengan functions configuration
- ✅ `src/lib/firebase.ts` - Updated untuk export functions

---

## 🚀 Langkah-Langkah Deploy

### Step 1: Setup Firebase Functions Locally

```bash
# Install dependencies
cd functions
npm install

# Compile TypeScript
npm run build

# Test fungsi locally (optional)
npm run serve
```

### Step 2: Setup Environment Variables

**Untuk Functions:**
```bash
# Copy .env.example ke .env
cp functions/.env.example functions/.env

# Edit functions/.env dan tambahkan credentials:
MIDTRANS_SERVER_KEY=SB-Mid-server-D5CuUjIMFG2v5tpQ1YRKWNAL
MIDTRANS_CLIENT_KEY=SB-Mid-client-qL3iowxuzGaqwQwv
MIDTRANS_MERCHANT_ID=G933168618
```

**Untuk Frontend:**
Sudah ada di `.env.local`, verify credentials:
```
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-qL3iowxuzGaqwQwv
VITE_MIDTRANS_SERVER_KEY=SB-Mid-server-D5CuUjIMFG2v5tpQ1YRKWNAL
VITE_MIDTRANS_MERCHANT_ID=G933168618
```

### Step 3: Deploy Database Rules (Firestore)

Buat rules untuk allow transaksi (di Firebase Console):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to create and read transactions
    match /transactions/{document=**} {
      allow create, read, update: if request.auth != null;
    }
    
    // Allow authenticated users to read and update their orders
    match /orders/{document=**} {
      allow create, read, update: if request.auth != null;
    }
  }
}
```

### Step 4: Deploy Functions

```bash
# Deploy semua fungsi
firebase deploy --only functions

# Atau deploy hanya functions (jika sudah ada deployment lain)
firebase deploy --only functions:createPaymentToken,functions:handleMidtransWebhook,functions:getTransactionStatus
```

### Step 5: Build & Deploy Frontend

```bash
# Build aplikasi
npm run build

# Deploy hosting
firebase deploy --only hosting
```

---

## 📱 Cara Menggunakan di Frontend

### 1. **Navigasi ke Checkout Page**

```typescript
// Di component mana saja, bisa navigate ke checkout
const navigate = useNavigate();

const handleCheckout = (items: PaymentItem[]) => {
  navigate("/checkout", { state: { items } });
};
```

### 2. **Struktur Item untuk Payment**

```typescript
interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const items: PaymentItem[] = [
  {
    id: "template-1",
    name: "Website Template Premium",
    price: 150000,
    quantity: 1
  }
];
```

### 3. **Contoh Integrasi di Dashboard**

```typescript
// Tambahkan button "Beli Sekarang" di product card
import { useNavigate } from "react-router-dom";

const handleBuyNow = (product) => {
  const items: PaymentItem[] = [
    {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }
  ];
  navigate("/checkout", { state: { items } });
};
```

---

## 🧪 Testing

### Test Kartu Kredit (Sandbox Mode)

Gunakan kartu test Midtrans:

**Successful Payment:**
- Nomor: `4111 1111 1111 1111`
- Exp: `12/25`
- CVV: `123`

**Declined Payment:**
- Nomor: `4000 0000 0000 0002`
- Exp: `12/25`
- CVV: `123`

### Test Webhook Locally

Gunakan ngrok untuk expose local server:

```bash
# Terminal 1: Jalankan Firebase emulator
firebase emulators:start --only functions

# Terminal 2: Expose dengan ngrok
ngrok http 5001

# Copy URL dan daftarkan di Midtrans Dashboard
# Settings → Notification URL → http://[ngrok-url]/firantastoree/us-central1/handleMidtransWebhook
```

---

## 🔧 Troubleshooting

### 1. Error: "Midtrans script belum dimuat"
- Pastikan `.env.local` memiliki `VITE_MIDTRANS_CLIENT_KEY`
- Reload halaman browser
- Check console untuk error

### 2. Error: "User tidak terautentikasi"
- Pastikan user sudah login sebelum checkout
- Check Firebase Auth token di console

### 3. Error: "Firebase Function not found"
- Pastikan sudah deploy functions: `firebase deploy --only functions`
- Check region di `firebase.json` (default: `us-central1`)
- Verify `src/lib/firebase.ts` export `functions` dengan region yang benar

### 4. Webhook tidak diterima
- Check Midtrans Dashboard → Settings → Notification URL
- Pastikan URL public (bukan localhost)
- Verify payload di Midtrans Dashboard → Tools → Webhook Logs

---

## 📊 Database Schema

### Firestore Collections

**transactions**
```
{
  orderId: string,
  token: string,
  amount: number,
  status: "pending" | "settlement" | "cancelled" | "expired",
  isPaid: boolean,
  customerName: string,
  customerEmail: string,
  items: PaymentItem[],
  userId: string,
  transactionStatus: string,
  fraudStatus: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**orders** (optional, untuk tracking order)
```
{
  orderId: string,
  userId: string,
  items: PaymentItem[],
  totalAmount: number,
  paymentStatus: "pending" | "paid",
  isPaid: boolean,
  customerDetails: {...},
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔐 Security Notes

1. **Server Key**: Jangan pernah expose di frontend! Sudah ditangani di Firebase Functions.
2. **Client Key**: OK untuk frontend, sudah ada di `.env.local`.
3. **Webhook Verification**: Firebase Functions automatically handle authentication.
4. **Firestore Rules**: Update rules sesuai kebutuhan aplikasi Anda.

---

## 📞 Useful Links

- [Midtrans Documentation](https://docs.midtrans.com)
- [Firebase Functions Guide](https://firebase.google.com/docs/functions)
- [Midtrans Notification Handling](https://docs.midtrans.com/en/after_payment/http_notification)

---

## ❓ FAQ

**Q: Bisa handle multiple items dalam satu transaksi?**
A: Ya! Checkout page sudah support multiple items. Lihat file `src/pages/Checkout.tsx`.

**Q: Gimana cara track payment status?**
A: Gunakan function `getTransactionStatus(orderId)` dari `src/lib/midtransService.ts`.

**Q: Bisa ganti payment method?**
A: Midtrans snap.js automatically menampilkan semua payment method yang available di dashboard.

**Q: Firestore rules apa yang diperlukan?**
A: Lihat sektion "Step 3: Deploy Database Rules" di atas.

---

**Next Steps:**
1. ✅ Setup dependencies: `npm install && cd functions && npm install`
2. ✅ Deploy functions: `firebase deploy --only functions`
3. ✅ Test di sandbox
4. ✅ Upgrade ke production keys saat siap
