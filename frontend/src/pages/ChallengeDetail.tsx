import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchChallenge, deleteChallenge } from "../api";
import { getRole } from "../auth";

export default function ChallengeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const isAdmin = getRole() === "admin";

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchChallenge(Number(id));
                setData(res);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    async function onDelete() {
        if (!window.confirm("Delete this challenge?")) return;
        await deleteChallenge(Number(id));
        navigate("/dashboard", { replace: true });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Challenge</h1>
                    <Link to="/dashboard" className="text-sm underline">Back</Link>
                </div>

                {loading && <div className="mt-6 text-slate-600">Loading...</div>}
                {!loading && data && (
                    <div className="mt-6 space-y-4">
                        <Row label="Title" value={data.title} />
                        <Row label="Reward" value={data.reward ?? "—"} />
                        <Row label="D-day" value={data.d_day ?? "—"} />
                        <Row label="Team Members" value={data.team_members ?? "—"} />
                        <Row label="Created" value={data.created_at ?? "—"} />

                        {/* Only admin; update, delete */}
                        {isAdmin && (
                            <div className="flex gap-3 pt-2">
                                {/* Update: if re-use form, move query string */}
                                <Link 
                                    to={`/challenge/${data.id}/edit`} 
                                    className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={onDelete}
                                    className="rounded-xl bg-red-600 text-white px-3 py-2 text-sm hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {!loading && !data && <div className="mt-6 text-slate-600">Not found.</div>}
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: any }) {
    return (
        <div>
            <div className="text-sm text-slate-500">{label}</div>
            <div className="font-medium">{String(value)}</div>
        </div>
    );
}
