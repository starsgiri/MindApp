export default function History() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-200">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center gap-4 mt-10">
        <h1 className="text-2xl font-bold text-green-700 mb-2">Past History</h1>
        <p className="text-gray-700 text-center">Here you will be able to view your previous mood and health status records, track your progress, and reflect on your mental health journey.</p>
        <span className="text-4xl mt-4">📈</span>
      </div>
    </div>
  );
} 