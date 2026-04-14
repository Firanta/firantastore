# 🚀 Firantastoree - Vercel Deployment Guide

Panduan lengkap deploy Midtrans payment integration dengan Firebase + Vercel backend (GRATIS).

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ Firebase project created
- ✅ Midtrans sandbox account
- ✅ GitHub account
- ✅ Vercel account

---

## 🔧 Step 1: Setup Firebase

### 1.1 Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init hosting firestore auth

# Select existing project or create new
```

### 1.2 Configure Firestore Rules
Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow transactions to be created and read by authenticated users
    match /transactions/{transactionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 1.3 Deploy Firebase
```bash
firebase deploy
```

---

## 🔧 Step 2: Setup Vercel Backend

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### 2.2 Deploy Backend
```bash
cd backend

# Initialize Vercel project
vercel

# Answer prompts:
# - Link to existing project? N
# - Project name: firantastoree-backend
# - Directory: ./backend (current directory)
```

### 2.3 Set Environment Variables
Via Vercel Dashboard atau CLI:

```bash
# Midtrans Server Key
vercel env add MIDTRANS_SERVER_KEY
# Input: SB-Mid-server-D5CuUjIMFG2v5tpQ1YRKWNAL

# Midtrans Client Key
vercel env add MIDTRANS_CLIENT_KEY
# Input: SB-Mid-client-qL3iowxuzGaqwQwv

# Firebase Service Account
vercel env add FIREBASE_SERVICE_ACCOUNT
# Input: {"type":"service_account",...} (paste entire JSON)
```

### 2.4 Deploy Backend
```bash
vercel --prod
```

**Save the Vercel URL** (contoh: `https://firantastoree-backend.vercel.app`)

---

## 🔧 Step 3: Update Frontend

### 3.1 Update Environment Variables
Edit `.env.local`:

```env
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-qL3iowxuzGaqwQwv
VITE_MIDTRANS_SERVER_KEY=SB-Mid-server-D5CuUjIMFG2v5tpQ1YRKWNAL
VITE_MIDTRANS_MERCHANT_ID=G933168618

# Update with your Vercel backend URL
VITE_BACKEND_URL=https://firantastoree-backend.vercel.app
```

### 3.2 Build Frontend
```bash
npm run build
```

### 3.3 Deploy Frontend to Firebase
```bash
firebase deploy --only hosting
```

---

## 🔧 Step 4: Configure Midtrans Webhook

### 4.1 Login to Midtrans Dashboard
- Go to [Midtrans Dashboard](https://dashboard.midtrans.com)
- Login with your sandbox account

### 4.2 Configure Webhook
1. **Settings** > **Configuration**
2. **Payment Notification URL**: `https://your-vercel-url.vercel.app/api/midtrans/webhook`
3. **Save Changes**

---

## 🧪 Step 5: Test Integration

### 5.1 Test Health Endpoint
```bash
curl https://your-vercel-url.vercel.app/api/health
```

### 5.2 Test Payment Flow
1. Open your Firebase hosted app
2. Login/Signup
3. Try to make a payment
4. Check Midtrans sandbox for transaction
5. Verify webhook notifications in Vercel logs

### 5.3 Check Logs
```bash
# Vercel logs
vercel logs

# Firebase logs
firebase functions:log
```

---

## 📊 Monitoring & Maintenance

### Vercel Dashboard
- **Functions**: Monitor API calls
- **Logs**: Check error logs
- **Analytics**: Performance metrics

### Firebase Console
- **Firestore**: Check transaction data
- **Authentication**: User management
- **Hosting**: Frontend deployment

### Midtrans Dashboard
- **Transactions**: Payment status
- **Webhooks**: Notification logs

---

## 🐛 Troubleshooting

### **Build Fails**
```bash
# Check Vercel build logs
vercel logs --follow

# Rebuild
vercel --prod
```

### **Environment Variables**
```bash
# List env vars
vercel env ls

# Update env var
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
```

### **Firebase Auth Issues**
- Check Firebase config in `src/lib/firebase.ts`
- Verify service account JSON format
- Ensure Firestore rules are deployed

### **Midtrans Issues**
- Check sandbox credentials
- Verify webhook URL format
- Test with Midtrans sandbox environment

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| **Firebase** | Spark (Free) | $0 |
| **Vercel** | Hobby | $0 |
| **Midtrans** | Sandbox | $0 |
| **Total** | - | **$0** 🎉 |

---

## 🔄 Update Workflow

```bash
# 1. Edit code
# 2. Test locally
npm run dev

# 3. Commit changes
git add .
git commit -m "Update payment logic"
git push origin main

# 4. Deploy backend (auto-deploy)
# 5. Deploy frontend
firebase deploy --only hosting

# 6. Check deployments
vercel ls
firebase hosting:channel:list
```

---

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Midtrans API Docs](https://docs.midtrans.com)
- [Express.js Guide](https://expressjs.com)

---

## ✅ Final Checklist

- [ ] Firebase project created & configured
- [ ] Firestore rules deployed
- [ ] Vercel backend deployed
- [ ] Environment variables set
- [ ] Frontend `.env.local` updated
- [ ] Midtrans webhook configured
- [ ] Payment flow tested
- [ ] Logs monitored

**🎉 Your Midtrans integration is ready!**

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel/Firebase/Midtrans logs
3. Verify all environment variables
4. Test with sandbox credentials first

Happy coding! 🚀