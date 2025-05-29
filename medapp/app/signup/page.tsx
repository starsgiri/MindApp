"use client";
import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !description) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-4">Sign up for Mindcare</p>
        <input
          type="text"
          placeholder="Name"
          className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <textarea
          placeholder="Describe yourself (e.g. interests, goals, anything you'd like to share)"
          className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[60px]"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-center font-semibold">Account created! Redirecting to login...</div>}
        <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition">Sign Up</button>
        <div className="text-center text-sm mt-2">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
} 