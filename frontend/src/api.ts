const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

function authHeader(): Record<string, string> {
    const t = localStorage.getItem("auth_token");
    return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function fetchMe() {
    const headers: HeadersInit = {
        ...authHeader(),
    };
    const r = await fetch(`${API_BASE}/auth/me`, { headers });
    if (!r.ok) throw new Error("Failed to load profile");
    return r.json();
}

export async function fetchChallenges() {
    const headers: HeadersInit = {
        ...authHeader(),
    };
    const r = await fetch(`${API_BASE}/api/challenges`, { headers });
    if (!r.ok) return [];
    return r.json();
}

export async function fetchChallenge(id: number) {
    const headers: HeadersInit = {
        ...authHeader(),
    };
    const r = await fetch(`${API_BASE}/api/challenge/${id}`, { headers });
    if (!r.ok) throw new Error("Failed to fetch challenge");
    return r.json();
}

export async function updateChallenge(id: number, patch: any) {
    const r = await fetch(`${API_BASE}/api/challenges/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(patch),
    });
    if (!r.ok) throw new Error("Update failed");
    return r.json();
}

export async function deleteChallenge(id: number) {
    const r = await fetch(`${API_BASE}/api/challenges/${id}`, {
        method: "DELETE",
        headers: { ...authHeader() },
    });
    if (!r.ok) throw new Error("Delete failed");
    return r.json();
}
