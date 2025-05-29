"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import Header from "./components/Header";
import { User } from "./components/UserMenu";
import { questionsByUser } from "./components/questions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const defaultUsers: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const moodOptions = [
  { label: "Happy", emoji: "😊", color: "bg-yellow-100", backlight: "#facc15" },
  { label: "Sad", emoji: "😢", color: "bg-blue-100", backlight: "#60a5fa" },
  { label: "Calm", emoji: "😌", color: "bg-green-100", backlight: "#4ade80" },
  { label: "Anxious", emoji: "😰", color: "bg-purple-100", backlight: "#a78bfa" },
  { label: "Excited", emoji: "🤩", color: "bg-pink-100", backlight: "#f472b6" },
  { label: "Tired", emoji: "🥱", color: "bg-gray-100", backlight: "#a3a3a3" },
  { label: "Angry", emoji: "😡", color: "bg-red-100", backlight: "#f87171" },
];

export default function Home() {
  const [user] = useState<User>({ id: 1, name: "Alice" });
  const [answers, setAnswers] = useState({
    selectedMood: null as string | null,
    healthStatus: "",
    mcqAnswers: [] as (number | null)[],
    gratitude: "",
    weeklyMood: [2, 3, 4, 1, 3, 5, 4],
    weeklyHealth: [3, 2, 4, 3, 4, 5, 4],
  });

  const addUser = () => {
    const name = prompt("Enter new user's name:");
    if (name) {
      alert(`User '${name}' created! Please login as this user.`);
    }
  };

  const userQ = questionsByUser[String(user.id)];
  const moods = userQ?.mood || ["😊", "😢", "😡", "😌", "😰", "🤩", "🥱"];
  const healthPrompt = userQ?.healthPrompt || "What is the status of your health?";
  const mcqs = userQ?.mcqs || [];
  const gratitudeEnabled = userQ?.gratitude ?? true;

  const updateAnswers = (update: any) => {
    setAnswers((prev) => ({ ...prev, ...update }));
  };

  // Weekly graph data
  const data = {
    labels: weekDays,
    datasets: [
      {
        label: "Mood",
        data: answers.weeklyMood,
        backgroundColor: "#facc15",
      },
      {
        label: "Health",
        data: answers.weeklyHealth,
        backgroundColor: "#38bdf8",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 5 },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-24 pb-10 px-2 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-violet-100">
      {/* Decorative blue-violet background shapes */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-blue-100 via-violet-100 to-transparent rounded-full blur-3xl opacity-70 z-0" />
      <div className="absolute top-1/2 -right-40 w-[350px] h-[350px] bg-gradient-to-tr from-violet-100 via-blue-50 to-transparent rounded-full blur-2xl opacity-60 z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-t from-blue-50 via-violet-100 to-transparent rounded-t-3xl blur-2xl opacity-60 z-0" />
      <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-30 z-0" />
      <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-violet-100 rounded-full blur-2xl opacity-20 z-0" />
      {/* Main content */}
      <Header />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-10 mt-4 z-10">
        {/* Mood Selection */}
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Select your mood...?</h2>
          <div className="flex justify-center gap-4 flex-wrap relative min-h-[140px]">
            {moodOptions.map((mood, idx) => (
              <div key={mood.label} className="relative flex flex-col items-center mb-2">
                <div
                  className={`relative flex flex-col items-center cursor-pointer group ${mood.color} rounded-xl shadow-lg px-6 py-4 transition-all duration-300 select-none`}
                  style={{
                    boxShadow:
                      answers.selectedMood === mood.label
                        ? `0 0 32px 10px ${mood.backlight}`
                        : undefined,
                    zIndex: answers.selectedMood === mood.label ? 10 : 1,
                  }}
                  onClick={() => updateAnswers({ selectedMood: mood.label })}
                >
                  <span className="text-4xl drop-shadow-lg mb-2">{mood.emoji}</span>
                  <span className={`text-2xl font-bold mb-1 ${answers.selectedMood === mood.label ? "text-black" : "text-gray-400"}`}>{mood.label}</span>
                  <span className="text-xs font-semibold text-blue-900">{mood.label}</span>
                  {/* Backlight effect */}
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background:
                        answers.selectedMood === mood.label
                          ? `radial-gradient(circle at 50% 80%, ${mood.backlight}55 60%, transparent 100%)`
                          : undefined,
                      zIndex: -1,
                      opacity: answers.selectedMood === mood.label ? 1 : 0,
                      transition: "opacity 0.3s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Health Status */}
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">{healthPrompt}</h2>
          <motion.div
            className={`relative bg-blue-50 border-2 border-blue-200 rounded-xl shadow-inner p-4 flex items-center transition-all duration-300`}
            initial={{ scale: 1 }}
            animate={{ scale: false ? 1.04 : 1, boxShadow: false ? "0 0 40px 0 #60a5fa77" : "0 2px 8px 0 #60a5fa22" }}
            transition={{ duration: 0.3 }}
          >
            <motion.textarea
              className="w-full bg-transparent outline-none resize-none text-blue-900 placeholder:text-blue-400 text-base min-h-[48px]"
              placeholder="Describe your health status..."
              value={answers.healthStatus}
              onChange={e => updateAnswers({ healthStatus: e.target.value })}
              animate={{ y: false ? -2 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute right-4 bottom-4 text-2xl animate-pulse"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >🩺</motion.span>
          </motion.div>
        </div>
        {/* MCQ Section */}
        <div className="flex flex-col gap-6">
          {mcqs.map((mcq: { question: string; options: string[] }, idx: number) => (
            <div key={mcq.question} className="bg-blue-50 rounded-xl p-4 shadow flex flex-col gap-2">
              <div className="font-semibold text-blue-800 mb-1">{mcq.question}</div>
              <div className="flex gap-2 flex-wrap">
                {mcq.options.map((opt: string, oidx: number) => (
                  <button
                    key={opt}
                    className={`px-3 py-1 rounded-lg border transition font-medium text-sm ${answers.mcqAnswers[idx] === oidx ? "bg-blue-400 text-white border-blue-600" : "bg-white border-blue-200 text-blue-700 hover:bg-blue-100"}`}
                    onClick={() => {
                      const newMcq = [...answers.mcqAnswers];
                      newMcq[idx] = oidx;
                      updateAnswers({ mcqAnswers: newMcq });
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Gratitude/Positive Prompt */}
        {gratitudeEnabled && (
          <div className="bg-green-50 rounded-xl p-4 shadow flex flex-col gap-2">
            <div className="font-semibold text-green-800 mb-1">Write one thing you're grateful for today:</div>
            <input
              type="text"
              className="border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={answers.gratitude}
              onChange={e => updateAnswers({ gratitude: e.target.value })}
              placeholder="E.g. My family, good weather, a friend..."
            />
          </div>
        )}
        {/* Weekly Graph */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-2 text-center">Your Weekly Mood & Health Status</h2>
          <div className="bg-white rounded-xl shadow p-4">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
