import { useEffect, useState } from "react";
import { fetchMe, fetchChallenges } from "../api";
import { Link } from "react-router-dom";

type Challenge = { id: number; title: string; reward: string; d_day: string; created_at?: string };

export default function Dashboard() {
    const [me, setMe] = useState<{ email: string; role: string } | null>(null);
    const [challenges, setchallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [m, list] = await Promise.all([fetchMe().catch(() => null), fetchChallenges().catch(() => [])]);
                setMe(m);
                setchallenges(Array.isArray(list) ? list : []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // demo numbers
    const stepsToday = 7421;
    const stepsWeek = 38542;

    return (
        <div className="justify-center">
            <div className="mx-auto max-w-4xl w-full px-4">
                <h1 className="text-2xl font-semibold mt-2 text-center">Alan Play Extension Dashboard</h1>

                {/* summary card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="rounded-2xl border p-4 text-center shadow-sm">
                        <div className="text-sm text-slate-500">My Steps (Today)</div>
                        <div className="text-2xl font-bold mt-1">{stepsToday.toLocaleString()}</div>
                    </div>
                    <div className="rounded-2xl border p-4 text-center shadow-sm">
                        <div className="text-sm text-slate-500">This Week</div>
                        <div className="text-2xl font-bold mt-1">{stepsWeek.toLocaleString()}</div>
                    </div>
                    <div className="rounded-2xl border p-4 text-center shadow-sm">
                        <div className="text-sm text-slate-500">Active Challenges</div>
                        <div className="text-2xl font-bold mt-1">{challenges.length}</div>
                    </div>
                </div>

                {/* my info */}
                {me && (
                    <div className="rounded-2xl border p-4 mt-6">
                        <div className="text-sm text-slate-500 mb-1">Signed in as</div>
                        <div className="font-medium">{me.email} <span className="text-slate-500">({me.role})</span></div>
                    </div>
                )}

                {/* Ongoing Challenges list */}
                <div className="mt-6">
                    <h2 className="font-semibold mb-3 text-center">Ongoing Challenges</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {challenges.map((c) => (
                            <Link
                                key={c.id}
                                to={`/challenge/${c.id}`}
                                className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition"
                            >
                                <div className="font-medium">{c.title}</div>
                                <div className="text-sm text-slate-600 mt-1">
                                    • Reward: {c.reward ?? "—"} <br/>
                                    • D-day: {c.d_day ?? "—"}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
