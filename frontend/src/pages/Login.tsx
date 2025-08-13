import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ShieldCheck, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { login as saveToken } from "../auth";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// Single-file login screen for the Walking Challenge demo
// - Tailwind + shadcn/ui
// - Role toggle (Admin / Team Member)
// - Basic client-side validation and loading state
// - Emits a fake login result if no backend is available
// Replace `fakeLogin` with your real API call (e.g., fetch('/api/auth/login'))
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

export default function LoginPage() {
    const [role, setRole] = useState<"admin" | "member">("member");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/dashboard";

    async function realLogin() {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                role: role === "member" ? "team_member" : "admin",
            }),
        });

        if (!res.ok) {
            // 401/403 error
            let msg = `HTTP ${res.status}`;
            try {
                const j = await res.json();
                if (j?.error) msg = j.error;
            } catch { }
            throw new Error(msg);
        }
        return res.json(); // { token, role, email }
    }
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { token, role: serverRole } = await realLogin();
            saveToken(token);
            localStorage.setItem("auth_role", serverRole);
            // ✅ to dashboard
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err?.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl border-slate-200">
                    <CardContent className="p-8">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Alan Play Extension</h1>
                            <p className="text-sm text-slate-600 mt-1">Sign in to join or manage your step challenge</p>
                        </div>

                        {/* Role Toggle */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <button
                                type="button"
                                onClick={() => setRole("member")}
                                className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-sm transition hover:shadow ${role === "member"
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-700"
                                    }`}
                            >
                                <Users className="h-4 w-4" /> Team Member
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-sm transition hover:shadow ${role === "admin"
                                    ? "border-violet-700 bg-violet-700 text-white"
                                    : "border-slate-200 bg-white text-slate-700"
                                    }`}
                            >
                                <ShieldCheck className="h-4 w-4" /> Admin
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={6}
                                        required
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-2">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full rounded-2xl h-11" disabled={loading}>
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                            {error && <div className="text-red-600">{error}</div>}
                        </form>

                        {/* Footer actions */}
                        <div className="mt-6 text-center text-sm text-slate-600">
                            <p>
                                No account? <a className="underline hover:text-slate-900" href="#">Create one</a>
                            </p>
                            <p className="mt-2">
                                <a className="underline hover:text-slate-900" href="#">Forgot password?</a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
