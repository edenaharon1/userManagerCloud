// src/api.js

import { useState, useEffect } from "react";

// 💡 פונקציה שמחזירה את BASE URL של ה-backend באופן דינמי
export async function getApiBase() {
  // אם מדובר בפיתוח מקומי, השתמש בכתובת המקומית
  if (process.env.NODE_ENV === "development") {
    console.log("Using local API URL for development.");
    return "http://localhost:3001/api"; // backend מקומי
  } 
  
  // אם מדובר בסביבת פרודקשן
  console.log("Using dynamic production API URL based on current host.");
  
  // מקבל את שם המארח (hostname) ואת הפורט הנוכחי של הדפדפן
  const hostName = window.location.hostname;
  const port = window.location.port;
  
  let baseUrl = `${window.location.protocol}//${hostName}`;
  
  // ✅ בודק אם קיים פורט, ואם כן, מוסיף אותו
  if (port && port !== "80" && port !== "443") {
    baseUrl += `:${port}`;
  }

  baseUrl += "/api";
  
  console.log("Determined API base URL:", baseUrl);
  return baseUrl;
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