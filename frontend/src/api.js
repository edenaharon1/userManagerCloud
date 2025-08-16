// src/api.js
import { useState, useEffect } from "react";

// 💡 פונקציה שמחזירה את BASE URL של ה-backend דינמית לפי כתובת הדפדפן
export async function getApiBase() {
  // אם מדובר בפיתוח מקומי
  if (process.env.NODE_ENV === "development") {
    console.log("Using local API URL for development.");
    return "http://localhost:3001/api"; // backend מקומי
  } else {
    console.log("Using dynamic production API URL based on current host.");

    // מקבל את ה-hostname של הדפדפן (IP או דומיין בלבד, בלי פורט)
    const hostName = window.location.hostname;
    const backendPort = 3001; // פורט ה-backend
    const baseUrl = `http://${hostName}:${backendPort}/api`;

    console.log("Determined API base URL:", baseUrl);
    return baseUrl;
  }
}

// 🔹 Hook שמחזיר את BASE URL באופן אסינכרוני ומנהל state
export const useApiBase = () => {
  const [apiBase, setApiBase] = useState(null);

  useEffect(() => {
    getApiBase().then(setApiBase);
  }, []);

  return apiBase;
};

// 🔹 פונקציית fetch מותאמת שמוסיפה את ה-BASE URL אוטומטית
export async function apiFetch(path, opts = {}) {
  const base = await getApiBase();
  if (!base) {
    throw new Error("Could not determine API base URL.");
  }

  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  console.log("📡 Fetching URL:", url);
  return fetch(url, opts);
}
