# Firantastoree Backend - Vercel Deployment

Express backend untuk Midtrans payment integration, deployed di Vercel.

## 🚀 Quick Start (Vercel)

### **Step 1: Setup Project**

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Initialize project
vercel

# Answer prompts:
# - Link to existing project? N
# - Project name: firantastoree-backend
# - Directory: ./backend
```

### **Step 2: Set Environment Variables**

Di Vercel Dashboard atau via CLI:

```bash
# Via CLI
vercel env add MIDTRANS_SERVER_KEY
# Input: SB-Mid-server-D5CuUjIMFG2v5tpQ1YRKWNAL

vercel env add MIDTRANS_CLIENT_KEY
# Input: SB-Mid-client-qL3iowxuzGaqwQwv

vercel env add FIREBASE_SERVICE_ACCOUNT
# Input: {"type":"service_account",...} (paste JSON)
```

### **Step 3: Deploy**

```bash
# Deploy
vercel --prod

# Get URL (contoh: https://firantastoree-backend.vercel.app)
```

### **Step 4: Update Frontend**

Edit `src/.env.local`:

```env
VITE_BACKEND_URL=https://firantastoree-backend.vercel.app
```

### **Step 5: Test**

```bash
# Test health endpoint
curl https://firantastoree-backend.vercel.app/api/health

# Should return:
{
  "status": "ok",
  "timestamp": "2024-04-05T...",
  "platform": "vercel"
}
```

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Edit .env dengan credentials Anda

# Development
npm run dev

# Build
npm run build
```

---

## 📋 API Endpoints

### 1. Health Check
```bash
GET /api/health
```

### 2. Create Payment Token
```bash
POST /api/midtrans/create-token
Authorization: Bearer {FIREBASE_ID_TOKEN}
Content-Type: application/json

{
  "orderId": "ORD-123",
  "amount": 150000,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "items": [
    {
      "id": "prod-1",
      "name": "Website Template",
      "price": 150000,
      "quantity": 1
    }
  ]
}
```

### 3. Webhook Handler
```bash
POST /api/midtrans/webhook

{
  "order_id": "ORD-123",
  "transaction_status": "settlement",
  "fraud_status": "accept"
}
```

### 4. Get Transaction Status
```bash
GET /api/midtrans/status/{orderId}
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

---

## 🔐 Firebase Service Account Setup

1. **Firebase Console** > Project Settings
2. **Service Accounts** tab
3. **Generate New Private Key**
4. **Download JSON file**
5. **Copy entire JSON content**
6. **Paste ke Vercel Environment Variable** `FIREBASE_SERVICE_ACCOUNT`

---

## 📊 Vercel Configuration

File `vercel.json` sudah dikonfigurasi untuk:
- ✅ Node.js 20 runtime
- ✅ Serverless functions
- ✅ Automatic routing
- ✅ CORS enabled

---

## 🐛 Troubleshooting

### **Build Fails**
```bash
# Check Vercel logs
vercel logs

# Rebuild
vercel --prod
```

### **Environment Variables**
```bash
# Check env vars
vercel env ls

# Update env var
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
```

### **Cold Start Issues**
- Vercel functions have cold starts (~1-3s)
- First request might be slow
- Subsequent requests are fast

---

## 📈 Monitoring

### **Vercel Dashboard**
- **Functions** tab: See function invocations
- **Logs** tab: Real-time logs
- **Analytics** tab: Performance metrics

### **Midtrans Dashboard**
- Check webhook notifications
- Monitor payment status
- View transaction logs

---

## 💰 Cost (Vercel Pro)

| Usage | Free Tier | Cost |
|-------|-----------|------|
| **Requests** | 100K/month | $0 |
| **Bandwidth** | 100GB/month | $0 |
| **Functions** | Unlimited | $0 |
| **Storage** | 100GB | $0 |

**Total: FREE** 🎉

---

## 🔄 Update Workflow

```bash
# 1. Edit code
# 2. Test locally
npm run dev

# 3. Commit & push
git add .
git commit -m "Update payment logic"
git push origin main

# 4. Vercel auto-deploys (2-3 minutes)
# 5. Check Vercel dashboard for deployment status
```

---

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Midtrans API](https://docs.midtrans.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

## ✅ Checklist Before Going Live

- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Firebase Service Account configured
- [ ] Frontend `.env.local` updated
- [ ] Test payment flow
- [ ] Midtrans webhook URL configured
- [ ] Firestore rules updated
- [ ] HTTPS enabled (automatic)

**Ready to deploy! 🚀**

## 🔌 API Endpoints

### 1. Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-04-05T..."
}
```

### 2. Create Payment Token
```bash
POST /api/midtrans/create-token
Authorization: Bearer {FIREBASE_ID_TOKEN}
Content-Type: application/json

{
  "orderId": "ORD-123",
  "amount": 150000,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "items": [
    {
      "id": "prod-1",
      "name": "Website Template",
      "price": 150000,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "token": "...",
  "orderId": "ORD-123"
}
```

### 3. Webhook Handler
```bash
POST /api/midtrans/webhook

{
  "order_id": "ORD-123",
  "transaction_status": "settlement",
  "fraud_status": "accept"
}
```

### 4. Get Transaction Status
```bash
GET /api/midtrans/status/{orderId}
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**Response:**
```json
{
  "token": "...",
  "amount": 150000,
  "status": "settlement",
  "isPaid": true,
  "transactionStatus": "settlement"
}
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# MIDTRANS_SERVER_KEY
# FIREBASE_SERVICE_ACCOUNT
```

### Option 2: Railway

1. Push to GitHub
2. Import project di [Railway.app](https://railway.app)
3. Set environment variables
4. Deploy!

### Option 3: Render

Similar to Railway - push to GitHub and connect.

## 🔐 Security Notes

- ✅ Verify Firebase ID token untuk setiap request
- ✅ Server Key dijaga di backend (tidak expose ke frontend)
- ✅ Client Key digunakan di frontend untuk Snap.js
- ✅ Webhook signature verification (bisa ditambah)

## 📝 Local Testing

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd ..
npm run dev

# Test endpoint
curl -X GET http://localhost:3001/health
```

## 🐛 Troubleshooting

**Error: "Unauthorized"**
- Pastikan Firebase ID token valid
- Check Authorization header format: `Bearer {token}`

**Error: "Failed to create token"**
- Check MIDTRANS_SERVER_KEY
- Verify Midtrans credentials

**Error: "Database not configured"**
- Set FIREBASE_SERVICE_ACCOUNT
- Firebase Admin SDK belum initialized

## 📚 Related Docs

- [Midtrans API](https://docs.midtrans.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Express.js](https://expressjs.com)
