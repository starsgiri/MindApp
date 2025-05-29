"use client";
import Link from "next/link";
import { useState } from "react";

const users = [
  { id: 1, name: "Alice", emoji: "👩" },
  { id: 2, name: "Bob", emoji: "🧑" },
  { id: 3, name: "Charlie", emoji: "👨‍🦱" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
    } else {
      setError("");
      window.location.href = "/";
    }
  };

  const handleUserLogin = (userId: number) => {
    // In a real app, set user context and redirect
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">Login to Mindcare</h2>
        <div className="flex flex-col gap-2 mb-4">
          <div className="text-center text-blue-600 font-semibold mb-2">Quick Login as:</div>
          <div className="flex gap-3 justify-center flex-wrap">
            {users.map(user => (
              <button
                key={user.id}
                className="flex flex-col items-center px-4 py-2 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition"
                onClick={() => handleUserLogin(user.id)}
              >
                <span className="text-3xl mb-1">{user.emoji}</span>
                <span className="text-blue-800 font-medium">{user.name}</span>
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition">Login</button>
        </form>
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
} 