// src/api.js
import { useState, useEffect } from "react";

// The base URL is dynamically determined based on the environment.
export async function getApiBase() {
  if (process.env.NODE_ENV === 'development') {
    console.log("Using local API URL for development.");
    return "http://localhost:3001/api"; // dev backend
  } else {
    console.log("Using production API URL.");
    // שימוש ב-relative path במקום IP קבוע
    return "/api"; 
  }
}

// A custom hook to get the API base URL asynchronously and manage state
export const useApiBase = () => {
  const [apiBase, setApiBase] = useState(null);

  useEffect(() => {
    getApiBase().then(setApiBase);
  }, []);

  return apiBase;
};

// A fetch wrapper function that automatically prefixes the base URL
export async function apiFetch(path, opts = {}) {
  const base = await getApiBase();
  if (!base) {
    throw new Error("Could not determine API base URL.");
  }

  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  return fetch(url, opts);
}
