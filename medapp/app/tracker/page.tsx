export default function Tracker() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-200">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center gap-4 mt-10">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">Tracker</h1>
        <p className="text-gray-700 text-center">This is where you can track your daily mood, health activities, and set reminders for self-care tasks. Stay consistent for a happier mind!</p>
        <span className="text-4xl mt-4">🗓️</span>
      </div>
    </div>
  );
} 