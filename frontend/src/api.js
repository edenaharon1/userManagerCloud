// src/api.js
import { useState, useEffect } from "react";

// קובע את בסיס ה-API לפי הסביבה
export async function getApiBase() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001/api";
  } else {
    const hostName = window.location.hostname;
    const backendPort = 3001;
    return `http://${hostName}:${backendPort}/api`;
  }
}

// Hook עזר למי שצריך את הבסיס ב-UI
export const useApiBase = () => {
  const [apiBase, setApiBase] = useState(null);
  useEffect(() => {
    getApiBase().then(setApiBase);
  }, []);
  return apiBase;
};

/**
 * apiFetch
 * ברירת מחדל: כל path יחסי -> נשלח ל-backend עם בסיס ה-API (כולל הפורט)
 * חריגים:
 *  - path שמתחיל ב-http/https -> נשלח כפי שהוא (חיצוני)
 *  - opts.raw === true -> נשלח כפי שהוא (קריאה “רגילה” ל-frontend/סטטי)
 */
export async function apiFetch(path, opts = {}) {
  const { raw = false, ...restOpts } = opts;

  // כתובת אבסולוטית? אל תיגעי בה.
  if (/^https?:\/\//i.test(path)) {
    console.log("🌐 Fetching absolute URL:", path);
    return fetch(path, restOpts);
  }

  // מבקשת במפורש לא לגעת? (למשל קובץ סטטי/נתיב frontend)
  if (raw) {
    const rawUrl = path;
    console.log("🌐 Fetching RAW/Frontend URL:", rawUrl);
    return fetch(rawUrl, restOpts);
  }

  // אחרת — זו קריאת API: נבנה URL ל-backend
  const base = await getApiBase();

  // אם התחיל ב-/api נסיר את ה-/api כי base כבר מכיל /api בסוף
  // אחרת נשמור את הנתיב כמו שהוא (נוסיף / אם חסר)
  const cleanedPath = path.startsWith("/api")
    ? path.replace(/^\/api/, "")
    : path.startsWith("/")
    ? path
    : `/${path}`;

  const url = `${base}${cleanedPath}`;
  console.log("📡 Fetching backend URL:", url);
  return fetch(url, restOpts);
}
