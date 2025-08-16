// src/api.js
import { useState, useEffect } from "react";

// 💡 פונקציה שמחזירה את BASE URL של ה-backend דינמית לפי כתובת הדפדפן
export async function getApiBase() {
  if (process.env.NODE_ENV === "development") {
    console.log("Using local API URL for development.");
    return "http://localhost:3001/api"; // backend מקומי
  } else {
    console.log("Using dynamic production API URL based on current host.");

    const { protocol, hostname, port } = window.location;
    const backendPort = 3001;

    // אם האתר נטען על 80/443 (כלומר LB/דומיין רגיל) — לא נוסיף פורט
    const isStandardWebPort = port === "" || port === "80" || port === "443";

    const baseUrl = isStandardWebPort
      ? `${protocol}//${hostname}/api`               // ללא פורט
      : `${protocol}//${hostname}:${backendPort}/api`; // עם פורט כשצריך

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
  // אם זו כתובת מוחלטת (http/https) — לא נוגעים
  if (/^https?:\/\//i.test(path)) {
    console.log("🌐 Fetching absolute URL:", path);
    return fetch(path, opts);
  }

  const base = await getApiBase();
  if (!base) {
    throw new Error("Could not determine API base URL.");
  }

  // אם path מתחיל ב-/api נסיר אותו כי base כבר כולל /api
  const cleanedPath = path.startsWith("/api")
    ? path.replace(/^\/api/, "")
    : path.startsWith("/")
    ? path
    : `/${path}`;

  const url = `${base}${cleanedPath}`;
  console.log("📡 Fetching URL:", url);
  return fetch(url, opts);
}
