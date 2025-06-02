import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
export type HeaderProps = {};

export default function Header() {
  const { logout } = useAuth();

  return (
    <motion.header
      className="w-full flex items-center justify-between px-6 py-4 bg-white/90 shadow-md rounded-b-2xl fixed top-0 left-0 z-50 backdrop-blur-md"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-3xl">🩺</span>
        <span className="text-2xl font-bold text-blue-700 cursor-pointer" onClick={() => window.location.href = "/"}>MindCare</span>
      </div>
      <nav className="flex gap-4 items-center">
        <Link href="/login" className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition">Login</Link>
        <Link href="/tracker" className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition">Tracker</Link>
        <Link
          href="/signup"
          className="px-4 py-2 rounded-lg bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200 transition shadow"
        >
          + New User
        </Link>
        <Link href={"/login"} onClick={() => logout()} className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-red-200 transition">Logout</Link>

      </nav>
    </motion.header>
  );
} 