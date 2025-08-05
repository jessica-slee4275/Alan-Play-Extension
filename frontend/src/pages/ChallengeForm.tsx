import { useState } from "react";
import api from "../lib/api";

export default function ChallengeForm() {
  const [title, setTitle] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [reward, setReward] = useState("");
  const [dDay, setDDay] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/challenges", {
      title,
      teamMembers: teamMembers.split(",").map(m => m.trim()),
      reward,
      dDay
    });
    alert("✅ Challenge created!");
    setTitle("");
    setTeamMembers("");
    setReward("");
    setDDay("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Create Challenge</h2>
      <input className="w-full border p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="w-full border p-2" placeholder="Team Members (comma-separated)" value={teamMembers} onChange={(e) => setTeamMembers(e.target.value)} />
      <input className="w-full border p-2" placeholder="Reward" value={reward} onChange={(e) => setReward(e.target.value)} />
      <input className="w-full border p-2" placeholder="D-Day (YYYY-MM-DD)" value={dDay} onChange={(e) => setDDay(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Submit</button>
    </form>
  );
}
