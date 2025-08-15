// src/api.js

import { useState, useEffect } from "react";

// The base URL is dynamically determined to handle different environments.
// We prioritize the current hostname, then a public IP service, and finally fallback to localhost.
export async function getApiBase() {
    // If running on a client-side environment (in a browser)
    if (typeof window !== "undefined" && window.location) {
        const host = window.location.hostname;
        // 1) Use the current hostname, if it's not a local address
        if (host && host !== "localhost" && host !== "127.0.0.1") {
            return `${window.location.protocol}//${host}:3001/api`;
        }
    }

    // 2) Attempt to get the public IP via a dedicated service
    try {
        const resp = await fetch("https://api.ipify.org?format=json");
        if (resp.ok) {
            const { ip } = await resp.json();
            if (ip) {
                console.log(`Using public IP: ${ip} for API calls.`);
                return `http://${ip}:3001/api`;
            }
        }
    } catch (e) {
        console.warn("Could not fetch public IP:", e?.message || e);
    }

    // 3) Final fallback to local development URL
    return "http://localhost:3001/api";
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
    // Change this line to correctly concatenate the base URL and the path
    const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
    return fetch(url, opts);
}