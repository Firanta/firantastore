# 🔧 Console Filter Configuration

## Overview

File [src/lib/consoleFilter.ts](src/lib/consoleFilter.ts) mengontrol apa yang ditampilkan di browser console dengan **3 modes**.

---

## 🎯 3 Filter Modes

### Mode 1: VERBOSE (Default - Saat Ini)
**Untuk:** Development dengan full visibility

```
✅ Tampilkan: Semua logs dari services
✅ Tampilkan: Semua warnings
❌ Suppress: Extension errors only
```

**Console Output:**
```
[MidtransService] Using backend URL: http://localhost:3001
[UserContext] Initializing auth state listener...
[AnimatedHeroTitle] Starting animation...
[AdminContext] No user authenticated
```

**Gunakan ketika:** Debugging aplikasi, need full logs

---

### Mode 2: STRICT (Recommended - Clean Console)
**Untuk:** Development production-like dengan clean console

```
❌ Suppress: Semua [Service] debug logs
✅ Tampilkan: Actual errors
❌ Suppress: Extension errors
```

**Console Output:**
```
(hanya critical errors tampil)
```

**Gunakan ketika:** Testing real user experience, want clean console

---

### Mode 3: QUIET (Ultra Clean)
**Untuk:** Final testing, production-like

```
❌ Suppress: Semua logs
✅ Tampilkan: Hanya critical errors
❌ Suppress: Semua warnings dan extensions
```

**Console Output:**
```
(hampir empty - hanya real errors)
```

**Gunakan ketika:** Final QA, simulating production

---

## 🔧 How to Change Mode

### Option 1: Edit Configuration (Persistent)

Edit [src/lib/consoleFilter.ts](src/lib/consoleFilter.ts) line 32-35:

```typescript
// SEKARANG (VERBOSE):
const FILTER_MODE: FilterMode = 'VERBOSE';

// BERUBAH KE (STRICT):
const FILTER_MODE: FilterMode = 'STRICT';

// ATAU (QUIET):
const FILTER_MODE: FilterMode = 'QUIET';
```

Restart dev server setelah perubahan.

### Option 2: Toggle di DevTools Console (Runtime)

**Switch ke STRICT:**
```javascript
window.setFilterMode('STRICT')
```

**Switch ke VERBOSE:**
```javascript
window.setFilterMode('VERBOSE')
```

**Switch ke QUIET:**
```javascript
window.setFilterMode('QUIET')
```

**Check mode saat ini:**
```javascript
window.getFilterMode()  // Returns: 'VERBOSE' | 'STRICT' | 'QUIET'
```

**Old method (still works):**
```javascript
window.toggleDebugLogs(false)  // Sama dengan STRICT
window.toggleDebugLogs(true)   // Sama dengan VERBOSE
```

---

## 📊 Mode Comparison

| Feature | VERBOSE | STRICT | QUIET |
|---------|---------|--------|-------|
| Service logs | ✅ Show | ❌ Hide | ❌ Hide |
| Warnings | ✅ Show | ✅ Show | ❌ Hide |
| Real errors | ✅ Show | ✅ Show | ✅ Show |
| Extension errors | ❌ Hide | ❌ Hide | ❌ Hide |
| Best for | Debugging | Testing | Final QA |

---

## 🎯 Recommended Setup

**During Development:**
```
VERBOSE mode → Full logs untuk debugging
```

**Before Deployment:**
```
STRICT mode → Test with cleaner console
```

**Final Testing:**
```
QUIET mode → Simulate production environment
```

---

## ✨ What Always Gets Suppressed

**These ALWAYS suppressed regardless of mode:**
- ❌ "listener indicated an asynchronous response"
- ❌ "message channel closed"
- ❌ "Extension context invalidated"
- ❌ "runtime.lastError"

**Reason:** Browser extension errors tidak important untuk app functionality

---

## 📝 Current Setting

**Current mode:** Check [line 32](src/lib/consoleFilter.ts#L32) di consoleFilter.ts

```typescript
const FILTER_MODE: FilterMode = 'VERBOSE'; // ← This is your setting
```

**Need clean console?** 
1. Quick: Run `window.setFilterMode('STRICT')` in DevTools
2. Permanent: Change line 32 to `'STRICT'` and restart dev server

---

**Tip: Use DevTools toggle method untuk quick testing, edit config untuk permanent change! 🎯**

