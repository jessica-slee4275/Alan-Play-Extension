import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchChallenge, updateChallenge } from "../api";

export default function ChallengeEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [reward, setReward] = useState("");
    const [d_day, setDDay] = useState("");           // 2025-12-04
    const [team_members, setTeamMembers] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 기존 데이터 불러와서 프리필
    useEffect(() => {
        (async () => {
            try {
                const c = await fetchChallenge(Number(id));
                setTitle(c.title ?? "");
                setReward(c.reward ?? "");
                setDDay(c.d_day ?? "");                
                setTeamMembers(c.team_members ?? "");
            } catch (e: any) {
                setError(e?.message ?? "Failed to load");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            await updateChallenge(Number(id), {
                title,
                reward,
                d_day: d_day,             
                team_members: team_members,
            });
            navigate(`/challenge/${id}`, { replace: true }); // after save, go to detail
        } catch (e: any) {
            setError(e?.message ?? "Update failed");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-6 text-center">Loading…</div>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Challenge</h1>
                    <Link to={`/challenge/${id}`} className="text-sm underline">Back</Link>
                </div>

                {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <Field label="Title">
                        <input
                            className="w-full rounded-xl border px-3 py-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Field>

                    <Field label="Reward">
                        <input
                            className="w-full rounded-xl border px-3 py-2"
                            value={reward}
                            onChange={(e) => setReward(e.target.value)}
                        />
                    </Field>

                    <Field label="D-day (YYYY-MM-DD)">
                        <input
                            className="w-full rounded-xl border px-3 py-2"
                            value={d_day}
                            onChange={(e) => setDDay(e.target.value)}
                            placeholder="2025-12-04"
                        />
                    </Field>

                    <Field label="Team Members">
                        <textarea
                            className="w-full rounded-xl border px-3 py-2 min-h-[96px]"
                            value={team_members}
                            onChange={(e) => setTeamMembers(e.target.value)}
                            placeholder="Comma or newline separated"
                        />
                    </Field>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <Link
                            to={`/challenge/${id}`}
                            className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <div className="text-sm text-slate-600 mb-1">{label}</div>
            {children}
        </label>
    );
}
