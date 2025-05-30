"use client";
import Link from "next/link";
import { useState } from "react";
import { authApi } from "../services/api";
import toast from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    const loadingToast = toast.loading("Creating your account...");
    try {
      setIsLoading(true);
      await authApi.register({
        name,
        email,
        password,
        description,
      });

      toast.success("Account created successfully!", { id: loadingToast });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Sign up for Mindcare
        </p>
        <input
          type="text"
          placeholder="Name"
          className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <textarea
          placeholder="Describe yourself (e.g. interests, goals, anything you'd like to share)"
          className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[60px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
        <div className="text-center text-sm mt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}