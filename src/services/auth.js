const API_URL = 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t) {
    localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}
export function isAuthenticated() {
    return !!getToken();
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (json?.code === '200' && json?.data) {
        setToken(json.data);
        return { ok: true, token: json.data, message: json.message || 'Connecté' };
    }

    const message = json?.message || 'Identifiants invalides';
    return { ok: false, message };
}

export function authHeader() {
    const t = getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
}
