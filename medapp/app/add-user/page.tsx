"use client";
import { useState } from "react";
import Link from "next/link";

const emojiOptions = ["👩", "🧑", "👨‍🦱", "👩‍⚕️", "🧑‍⚕️", "👨‍⚕️", "🧑‍🎓", "👩‍🎓"];

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(emojiOptions[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !description || !emoji) {
      setError("Please fill in all fields.");
    } else {
      setError("");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-pink-700 text-center mb-2">Add New User</h2>
        <input
          type="text"
          placeholder="Name"
          className="border border-pink-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-pink-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-pink-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <textarea
          placeholder="Describe yourself (e.g. interests, goals, anything you'd like to share)"
          className="border border-pink-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[60px]"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div className="flex gap-2 items-center justify-center">
          {emojiOptions.map(opt => (
            <button
              type="button"
              key={opt}
              className={`text-2xl px-2 py-1 rounded-full border-2 ${emoji === opt ? "border-pink-500 bg-pink-100" : "border-transparent"}`}
              onClick={() => setEmoji(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-center font-semibold">User added! Redirecting to login...</div>}
        <button type="submit" className="bg-pink-600 text-white rounded py-2 font-semibold hover:bg-pink-700 transition">Add User</button>
        <div className="text-center text-sm mt-2">
          Already have an account? <Link href="/login" className="text-pink-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
} 