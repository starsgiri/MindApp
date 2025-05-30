import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  emoji?: string;
  description?: string;
}

export interface Mood {
  id: number;
  label: string;
  emoji: string;
  color: string;
  backlight: string;
}

export interface MoodEntry {
  id: number;
  user_id: number;
  mood_id: number;
  entry_date: string;
}

export interface MCQEntry {
  id: number;
  user_id: number;
  question: string;
  answer: string;
  entry_date: string;
}

export interface GratitudeEntry {
  id: number;
  user_id: number;
  gratitude_text: string;
  entry_date: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const register = async (data: Omit<User, 'id'>) => {
  const response = await api.post('/user/register', data);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/user/login', { email, password });
  return response.data;
};

export const getProfile = async (userId: number) => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

// Mood endpoints
export const getAllMoods = async () => {
  const response = await api.get('/mood');
  return response.data;
};

export const addMoodEntry = async (entry: Omit<MoodEntry, 'id'>) => {
  const response = await api.post('/entry/mood', entry);
  return response.data;
};

export const getMoodEntries = async (userId: number) => {
  const response = await api.get(`/entry/mood/${userId}`);
  return response.data;
};

// MCQ endpoints
export const addMcqEntry = async (entry: Omit<MCQEntry, 'id'>) => {
  const response = await api.post('/entry/mcq', entry);
  return response.data;
};

export const getMcqEntries = async (userId: number) => {
  const response = await api.get(`/entry/mcq/${userId}`);
  return response.data;
};

// Gratitude endpoints
export const addGratitudeEntry = async (entry: Omit<GratitudeEntry, 'id'>) => {
  const response = await api.post('/entry/gratitude', entry);
  return response.data;
};

export const getGratitudeEntries = async (userId: number) => {
  const response = await api.get(`/entry/gratitude/${userId}`);
  return response.data;
};