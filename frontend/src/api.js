// src/api.js

import { useState, useEffect } from "react";

// The base URL is dynamically determined based on the environment.
// This is the correct and standard way to handle different API endpoints.
export async function getApiBase() {
    // --------------------------------------------------------------------------------
    // 💡 שינוי מהותי: הגדרת ה-API URL בהתאם לסביבת העבודה (Development או Production)
    // --------------------------------------------------------------------------------
    if (process.env.NODE_ENV === 'development') {
        // אם אנחנו בסביבת פיתוח, נשתמש בכתובת המקומית (localhost).
        console.log("Using local API URL for development.");
        return "http://localhost:3001/api";
    } else {
        // אם אנחנו בסביבת פרודקשן (אחרי npm run build), נשתמש בכתובת הציבורית.
        console.log("Using production API URL.");
        // ניתן להוסיף כאן גם את ה-protocol וה-port אם הם משתנים
        // לדוגמה, אם האתר רץ ב-HTTPS בפרודקשן:
        // return "https://your-domain.com:3001/api";
        return "http://79.177.154.226:3001/api";
    }
    // --------------------------------------------------------------------------------
    // הלוגיקה המקורית והמורכבת הוסרה מכיוון שהיא יוצרת בעיות ואינה הדרך המקובלת
    // --------------------------------------------------------------------------------
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