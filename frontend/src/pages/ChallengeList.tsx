import { useEffect, useState } from "react";
import axios from "axios";  

interface Challenge {
  id: number;
  title: string;
  teamMembers: string[];
  reward: string;
  dDay: string;
  created_at: string;
}

export default function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const fetchChallenges = () => {
    axios
      .get<Challenge[]>("http://localhost:5000/api/challenges")
      .then((res) => setChallenges(res.data))
      .catch((err) => console.error("Failed to fetch challenges", err));
  };

  const deleteChallenge = async (id: number) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;
    await axios.delete(`http://localhost:5000/api/challenges/${id}`);
    setChallenges((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen p-10">
      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">📋 Created Challenges</h2>
        {challenges.length === 0 && (
          <p className="text-gray-500">No challenges created yet.</p>
        )}
        {challenges.map((ch) => (
          <div
            key={ch.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative"
          >
            <button
              onClick={() => deleteChallenge(ch.id)}
              className="absolute top-3 right-4 text-red-500 text-sm hover:text-red-700"
            >
              🗑 Delete
            </button>
            <p className="text-lg font-semibold text-blue-700">{ch.title}</p>
            <p className="text-sm text-gray-600">
              Team: {ch.teamMembers?.join(", ")}
            </p>
            <p className="text-sm text-gray-700">Reward: {ch.reward}</p>
            <p className="text-sm text-gray-700">D-Day: {ch.dDay}</p>
            <p className="text-xs text-gray-400">
              Created At: {new Date(ch.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}