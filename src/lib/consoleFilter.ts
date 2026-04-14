/**
 * Console Filter Utility
 * Suppress non-critical debug logs while keeping errors
 * 
 * Modes:
 * - VERBOSE (default): Show all logs + suppress extension errors
 * - STRICT: Suppress all debug logs + suppress extension errors
 */

// Extension errors yang SELALU di-suppress (safe to ignore)
const SAFE_TO_SUPPRESS = [
  'listener indicated an asynchronous response',
  'message channel closed',
  'Extension context invalidated',
  'runtime.lastError',
];

// Debug log patterns yang bisa di-suppress (per service)
const SUPPRESSIBLE_PATTERNS = [
  '[MidtransService]',
  '[UserContext]',
  '[AdminContext]',
  '[AnimatedHeroTitle]',
  '[SignIn]',
  '[SignUp]',
  '[AdminLogin]',
  '[Auth]',
];

// ========================================
// CONFIGURATION - Change mode here:
// ========================================
// Set to 'STRICT' untuk clean console (suppress semua debug logs)
// Set ke 'VERBOSE' untuk melihat semua logs (development tapi tidak terlalu verbose)
// Set ke 'QUIET' untuk ultra clean (hanya error yang critical)
type FilterMode = 'VERBOSE' | 'STRICT' | 'QUIET';
const FILTER_MODE: FilterMode = 'VERBOSE'; // ← Change ini untuk suppress logs
// ========================================

let currentFilterMode: FilterMode = FILTER_MODE;

export const setupConsoleFilters = () => {
  // Only setup in development
  if (!import.meta.env.DEV) return;

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  /**
   * Filter console.log berdasarkan mode
   */
  console.log = function(...args) {
    const message = String(args[0] || '');
    
    // STRICT mode: suppress semua debug logs dari services
    if (currentFilterMode === 'STRICT' || currentFilterMode === 'QUIET') {
      for (const pattern of SUPPRESSIBLE_PATTERNS) {
        if (message.includes(pattern)) {
          return;
        }
      }
    }
    
    // Jika QUIET, suppress juga logs tanpa [Service] format
    if (currentFilterMode === 'QUIET') {
      // Suppress semua logs kecuali error-related
      return;
    }
    
    originalLog.apply(console, args);
  };

  /**
   * Filter console.warn - suppress non-critical warnings
   */
  console.warn = function(...args) {
    const message = String(args[0] || '');
    
    // Suppress Firestore warnings (benign)
    if (message.includes('Firestore') || message.includes('deprecated')) {
      return;
    }
    
    // In STRICT atau QUIET mode, suppress more warnings
    if ((currentFilterMode === 'STRICT' || currentFilterMode === 'QUIET') && message.includes('[')) {
      return;
    }
    
    originalWarn.apply(console, args);
  };

  /**
   * Filter console.error - suppress extension errors ONLY
   * Actual errors tetap ditampilkan
   */
  console.error = function(...args) {
    const message = String(args[0] || '');
    
    // Check if it's a safe-to-suppress error (extension errors)
    for (const pattern of SAFE_TO_SUPPRESS) {
      if (message.includes(pattern)) {
        return; // Don't log this error
      }
    }
    
    // Log all other errors (actual application errors)
    originalError.apply(console, args);
  };

  /**
   * Suppress unhandled promise rejections from extensions
   */
  window.addEventListener('unhandledrejection', (event) => {
    const message = String(event.reason?.message || '');
    
    for (const pattern of SAFE_TO_SUPPRESS) {
      if (message.includes(pattern)) {
        event.preventDefault(); // Prevent error from showing
        return;
      }
    }
  });
};

/**
 * Toggle console filter mode at runtime
 * Usage: 
 *   window.setFilterMode('VERBOSE')  - show all logs
 *   window.setFilterMode('STRICT')   - hide service debug logs
 *   window.setFilterMode('QUIET')    - hide almost everything except errors
 *   window.getFilterMode()           - check current mode
 */
declare global {
  interface Window {
    toggleDebugLogs: (enable: boolean) => void;
    setFilterMode: (mode: FilterMode) => void;
    getFilterMode: () => FilterMode;
  }
}

export const setupToggleDebugLogs = () => {
  window.toggleDebugLogs = (enable: boolean) => {
    const newMode = enable ? 'VERBOSE' : 'STRICT';
    currentFilterMode = newMode;
    console.log(`[Console Filter] Mode changed to: ${newMode}`);
  };

  window.setFilterMode = (mode: FilterMode) => {
    if (!['VERBOSE', 'STRICT', 'QUIET'].includes(mode)) {
      console.error(`[Console Filter] Invalid mode: ${mode}. Use VERBOSE, STRICT, or QUIET`);
      return;
    }
    currentFilterMode = mode;
    console.log(`[Console Filter] Mode changed to: ${mode}`);
  };

  window.getFilterMode = () => {
    return currentFilterMode;
  };

  // Show current mode on startup
  console.log(`[Console Filter] Started in ${currentFilterMode} mode`);
};
