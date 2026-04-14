import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/firebase"; // Initialize Firebase
import { setupConsoleFilters, setupToggleDebugLogs } from "./lib/consoleFilter";

// ===============================================
// SETUP CONSOLE FILTERS
// ===============================================
setupConsoleFilters();
setupToggleDebugLogs();

createRoot(document.getElementById("root")!).render(<App />);
