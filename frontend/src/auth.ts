export const TOKEN_KEY = "auth_token";

export function isAuthed(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
}

export function getRole(): "admin" | "team_member" | null {
    return (localStorage.getItem("auth_role") as any) ?? null;
}

export function login(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("auth_role");
}
