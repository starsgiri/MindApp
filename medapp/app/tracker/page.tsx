'use client'
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { moodApi } from '../services/api';
interface MCQAnswers {
  productivity: string;
  stress_level: string;
  sleep_quality: string;
  physical_activity: string;
  social_interaction: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  emoji: string;
  description: string;
}

interface MoodData {
  id: number;
  user_id: number;
  label: string;
  emoji: string;
  healthStatus: string;
  gratitudeText: string;
  mcqAnswers: MCQAnswers;
  entry_date: string;
  createdAt: string;
  updatedAt: string;
  User: User;
}

const Page = () => {
  const [moods, setMoods] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true);
        const data = await moodApi.getAllMoods();
        setMoods(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch moods');
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMCQValue = (value: string) => {
  if (!value || typeof value !== 'string') {
    return 'N/A';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading moods...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">Mood Tracker Dashboard</h1>
            <p className="text-purple-100">View all mood entries from users</p>
          </div>

          <div className="p-6">
            {moods.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-gray-500 text-lg">No mood entries found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">User</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Mood</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Health Status</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Gratitude</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Wellness Metrics</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moods.map((mood, index) => (
                      <tr key={mood.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-200 px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{mood.User.emoji}</div>
                            <div>
                              <div className="font-medium text-gray-900">{mood.User.name}</div>
                              <div className="text-sm text-gray-500">{mood.User.email}</div>
                              <div className="text-xs text-gray-400 mt-1">{mood.User.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <div className="text-3xl mb-1">{mood.emoji}</div>
                            <div className="font-medium text-gray-900">{mood.label}</div>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-4">
                          <div className="text-sm text-gray-700">{mood.healthStatus}</div>
                        </td>
                        <td className="border border-gray-200 px-4 py-4">
                          <div className="text-sm text-gray-700 max-w-xs">{mood.gratitudeText}</div>
                        </td>
                        <td className="border border-gray-200 px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Productivity:</span>
                              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {formatMCQValue(mood.mcqAnswers.productivity)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Stress:</span>
                              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                {formatMCQValue(mood.mcqAnswers.stress_level)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Sleep:</span>
                              <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                {formatMCQValue(mood.mcqAnswers.sleep_quality)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Activity:</span>
                              <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                {formatMCQValue(mood.mcqAnswers.physical_activity)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Social:</span>
                              <span className="text-xs font-medium px-2 py-1 bg-pink-100 text-pink-800 rounded-full">
                                {formatMCQValue(mood.mcqAnswers.social_interaction)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-4">
                          <div className="text-sm text-gray-700">{formatDate(mood.entry_date)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {moods.length} mood {moods.length === 1 ? 'entry' : 'entries'}
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;