import { useState } from "react";
import axios from "axios";

export default function ChallengeForm() {
  const [title, setTitle] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [reward, setReward] = useState("");
  const [dDay, setDDay] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/challenges", {
      title,
      teamMembers: teamMembers.split(",").map((name) => name.trim()),
      reward,
      dDay,
    });
    alert("✅ Challenge created!");
    setTitle("");
    setTeamMembers("");
    setReward("");
    setDDay("");
  };

  return (
    <div className="flex justify-center p-10 bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">Create Challenge</h2>

        <input
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Team Members (comma-separated)"
          value={teamMembers}
          onChange={(e) => setTeamMembers(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Reward"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="D-Day (YYYY-MM-DD)"
          value={dDay}
          onChange={(e) => setDDay(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
