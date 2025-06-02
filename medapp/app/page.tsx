"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import Header from "./components/Header";
import { User } from "./components/UserMenu";
import { questionsByUser } from "./components/questions";
import { moodApi } from "./services/api";
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
  const [user, setUser] = useState<User | null>(null);
  const [answers, setAnswers] = useState({
    selectedMood: null as string | null,
    healthStatus: "",
    mcqAnswers: [] as (number | null)[],
    gratitude: "",
    weeklyMood: [3, 3, 3, 3, 3, 3, 3], // Default neutral values
    weeklyHealth: [3, 3, 3, 3, 3, 3, 3], // Default neutral values
  });
  const [weekDays, setWeekDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Get user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch mood stats when user is available
  useEffect(() => {
    if (user) {
      fetchMoodStats();
    }
  }, [user]);

  const fetchMoodStats = async () => {
    try {
      setIsLoadingStats(true);
      const stats = await moodApi.getMoodStats();
      
      // Update the answers state with fetched data
      setAnswers(prev => ({
        ...prev,
        weeklyMood: stats.weeklyMood || prev.weeklyMood,
        weeklyHealth: stats.weeklyHealth || prev.weeklyHealth,
      }));
      
      // Update week days if provided by backend
      if (stats.weekDays) {
        setWeekDays(stats.weekDays);
      }
      
      console.log('Mood stats fetched:', stats);
    } catch (error) {
      console.error('Error fetching mood stats:', error);
      // Keep default values if fetch fails
    } finally {
      setIsLoadingStats(false);
    }
  };

  const addUser = () => {
    const name = prompt("Enter new user's name:");
    if (name) {
      alert(`User '${name}' created! Please login as this user.`);
    }
  };

  const userQ = questionsByUser[String(user?.id || 1)];
  const moods = userQ?.mood || ["😊", "😢", "😡", "😌", "😰", "🤩", "🥱"];
  const healthPrompt = userQ?.healthPrompt || "What is the status of your health?";
  const mcqs = userQ?.mcqs || [];
  const gratitudeEnabled = userQ?.gratitude ?? true;

  const updateAnswers = (update: any) => {
    setAnswers((prev) => ({ ...prev, ...update }));
  };

  // Updated function to handle saving responses to API
  const handleSaveResponse = async () => {
    if (!user) {
      alert("Please log in to save your response.");
      return;
    }

    if (!answers.selectedMood) {
      alert("Please select a mood before saving.");
      return;
    }

    setIsLoading(true);
    setSaveStatus('idle');

    try {
      // Find the selected mood option to get the emoji
      const selectedMoodOption = moodOptions.find(mood => mood.label === answers.selectedMood);
      
      // Convert MCQ answers to the expected format
      const mcqAnswersFormatted: { [key: string]: string } = {};
      mcqs.forEach((mcq: any, index: number) => {
        if (answers.mcqAnswers[index] !== null && answers.mcqAnswers[index] !== undefined) {
          // Create a key from the question (simplified)
          const key = mcq.question.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
          const selectedOption = mcq.options[answers.mcqAnswers[index]];
          mcqAnswersFormatted[key] = selectedOption;
        }
      });

      // Prepare the data to send to API
      const moodData = {
        user_id: user.id,
        label: answers.selectedMood,
        emoji: selectedMoodOption?.emoji || "😊",
        healthStatus: answers.healthStatus || undefined,
        gratitudeText: answers.gratitude || undefined,
        mcqAnswers: Object.keys(mcqAnswersFormatted).length > 0 ? mcqAnswersFormatted : undefined,
      };

      console.log("Sending mood data:", moodData);

      // Call the API
      const response = await moodApi.addMoodEntry(moodData);
      
      console.log("API Response:", response);
      setSaveStatus('success');
      alert("Response saved successfully!");

      // Refresh mood stats after saving
      await fetchMoodStats();

      // Optionally reset the form (uncomment if you want to clear the form)
      // setAnswers({
      //   selectedMood: null,
      //   healthStatus: "",
      //   mcqAnswers: [],
      //   gratitude: "",
      //   weeklyMood: answers.weeklyMood,
      //   weeklyHealth: answers.weeklyHealth,
      // });

    } catch (error: any) {
      console.error("Error saving mood entry:", error);
      setSaveStatus('error');
      alert(`Failed to save response: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
      y: { 
        beginAtZero: true, 
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
            return labels[value] || value;
          }
        }
      },
    },
  };

  if (!user) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-10 px-2 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-violet-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Please log in to continue</h2>
          <p className="text-blue-600">You need to be logged in to track your mood.</p>
        </div>
      </div>
    );
  }

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
        {/* User info */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-blue-700">Welcome, {user.name}! {user.emoji}</h1>
        </div>

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
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-blue-700">Current Weekly Mood & Health Status of all the Users</h2>
            <button
              onClick={fetchMoodStats}
              disabled={isLoadingStats}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              {isLoadingStats ? (
                <>
                  <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  🔄 Refresh
                </>
              )}
            </button>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            {isLoadingStats ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Bar data={data} options={options} />
            )}
          </div>
        </div>

        {/* Save Response Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSaveResponse}
            disabled={isLoading || !answers.selectedMood}
            className={`px-8 py-3 font-bold rounded-full shadow-lg focus:outline-none focus:ring-4 transition-all duration-300 transform ${
              isLoading || !answers.selectedMood
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 hover:scale-105"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              "Save Response"
            )}
          </button>
        </div>

        {/* Status Message */}
        {saveStatus === 'success' && (
          <div className="text-center text-green-600 font-medium">
            ✅ Response saved successfully!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="text-center text-red-600 font-medium">
            ❌ Failed to save response. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}