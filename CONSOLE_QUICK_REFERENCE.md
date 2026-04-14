# 🚀 Console Filter - Quick Reference

## Fastest Way to Clean Console

### Open DevTools (F12 or Cmd+Option+I) → Go to Console Tab → Paste:

```javascript
window.setFilterMode('STRICT')
```

**Done!** Debug logs will disappear immediately. 

---

## Toggle Between Modes

```javascript
// VERBOSE (show all logs)
window.setFilterMode('VERBOSE')

// STRICT (hide service debug logs, keep errors)
window.setFilterMode('STRICT')

// QUIET (hide everything except critical errors)
window.setFilterMode('QUIET')

// Check current mode
window.getFilterMode()
```

---

## What Each Mode Shows

| Command | Shows | Hides |
|---------|-------|-------|
| `setFilterMode('VERBOSE')` | All logs | Extension errors |
| `setFilterMode('STRICT')` | Errors only | Service logs, extension errors |
| `setFilterMode('QUIET')` | Critical errors | Everything else |

---

## Result After Running

**Before:**
```
[MidtransService] Using backend URL: http://localhost:3001
[UserContext] Initializing auth state listener...
[AdminContext] No user authenticated
listener indicated an asynchronous response...
listener indicated an asynchronous response... (20×)
```

**After `window.setFilterMode('STRICT')`:**
```
(clean console - only real errors show)
```

---

## Make It Permanent

Edit [src/lib/consoleFilter.ts](src/lib/consoleFilter.ts) line 32:

```typescript
// Change this:
const FILTER_MODE: FilterMode = 'VERBOSE';

// To this:
const FILTER_MODE: FilterMode = 'STRICT';

// Then restart dev server
```

---

## Old Method (Still Works)

```javascript
window.toggleDebugLogs(false)  // Hide logs
window.toggleDebugLogs(true)   // Show logs
```

---

**💡 Pro Tip:** Use DevTools command for quick testing, edit config for permanent change!
