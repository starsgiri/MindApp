"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";
import * as api from "../lib/api";

const users = [
  { id: 1, name: "Alice", emoji: "👩", email: "alice@example.com", password: "password123" },
  { id: 2, name: "Bob", emoji: "🧑", email: "bob@example.com", password: "password123" },
  { id: 3, name: "Charlie", emoji: "👨‍🦱", email: "charlie@example.com", password: "password123" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoUser: typeof users[0]) => {
    setLoading(true);
    try {
      const data = await api.login(demoUser.email, demoUser.password);
      setUser(data.user);
      router.push("/");
    } catch (err) {
      setError("Demo login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
                className="flex flex-col items-center px-4 py-2 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition disabled:opacity-50"
                onClick={() => handleQuickLogin(user)}
                disabled={loading}
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
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}