import axios from 'axios';

// ─── Base URL ────────────────────────────────────────────────────────────────
// Development  → uses Vite's proxy (empty string → relative /api/...)
// Production   → set VITE_API_BASE_URL=https://your-api.com in Vercel env vars
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_DEV_URL || ''
    : '';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor: Attach JWT Token ────────────────────────────────────
// The backend expects: Authorization: Bearer <token>
// Token is stored in localStorage as part of the user object after login.
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('fieldOpsUser');
        if (userInfo) {
            try {
                const user = JSON.parse(userInfo);
                if (user?.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch {
                // Ignore malformed JSON in localStorage
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle Auth Errors ─────────────────────────────────
// If the server responds with 401 (token expired / invalid), auto-logout the user.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear stale session and redirect to login
            localStorage.removeItem('fieldOpsUser');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;