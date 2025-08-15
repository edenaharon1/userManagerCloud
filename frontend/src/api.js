// src/api.js
// Single source of truth for API calls with dynamic base URL

// מחזיר את ה-API base URL דינמית
export async function getApiBase() {
  // 1) אם ה-frontend רץ מאותו host
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `${window.location.protocol}//${host}:3001/api`;
    }
  }

  // 2) נסיון לקבל public IP דרך api.ipify.org
  try {
    const resp = await fetch("https://api.ipify.org?format=json");
    if (resp.ok) {
      const { ip } = await resp.json();
      if (ip) return `http://${ip}:3001/api`;
    }
  } catch (e) {
    console.warn("Could not fetch public IP:", e?.message || e);
  }

  // 3) fallback ל-.env
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, "");
  }

  // 4) fallback אחרון
  return "http://localhost:3001/api";
}

// פונקציה עוטפת fetch שמוסיפה את ה-base URL אוטומטית
export async function apiFetch(path, opts = {}) {
  const base = await getApiBase();
  const url = base.replace(/\/+$/, "") + (path.startsWith("/") ? path : `/${path}`);
  return fetch(url, opts);
}
