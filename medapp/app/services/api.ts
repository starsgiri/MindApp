import axios from 'axios';
import type { AxiosResponse } from 'axios';

// Types
interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    emoji?: string;
    description?: string;
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    emoji?: string;
    description?: string;
}

interface MoodData {
    selectedMood?: string;
    healthStatus?: string;
    mcqAnswers?: any[];
    gratitude?: string;
    weeklyMood?: number[];
    weeklyHealth?: number[];
    label?: string;
    emoji?: string;
    gratitudeText?: string;
    user_id?: string;
}

interface MoodEntry {
    id: string;
    user_id: string;
    label?: string;
    emoji?: string;
    healthStatus?: string;
    gratitudeText?: string;
    mcqAnswers?: any[];
    entry_date: string;
    created_at: string;
}

interface MoodStats {
    [date: string]: {
        label: string;
        emoji: string;
    }[];
}

interface EntryData {
    userId: string;
    content: string;
    mood?: string;
    tags?: string[];
}

interface Entry {
    id: string;
    userId: string;
    content: string;
    mood?: string;
    tags?: string[];
    created_at: string;
}

interface ApiResponse<T = any> {
    data: T;
    message?: string;
    error?: string;
}

// Utility function to safely access localStorage
const getStorageItem = (key: string): string | null => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem(key);
        }
        return null;
    } catch (error) {
        console.warn('localStorage not available:', error);
        return null;
    }
};

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000, // Increased timeout to 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = getStorageItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common HTTP errors
        if (error.response?.status === 401) {
            // Token expired or invalid - redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // You might want to redirect to login page here
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authApi = {
    login: async (email: string, password: string): Promise<ApiResponse> => {
        try {
            const response: AxiosResponse<ApiResponse> = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Login failed';
            throw new Error(errorMessage);
        }
    },

    register: async (userData: RegisterData): Promise<ApiResponse> => {
        try {
            const response: AxiosResponse<ApiResponse> = await api.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
            throw new Error(errorMessage);
        }
    },

    getProfile: async (userId: string): Promise<UserProfile> => {
        try {
            const response: AxiosResponse<UserProfile> = await api.get(`/auth/profile/${userId}`);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch profile';
            throw new Error(errorMessage);
        }
    },
};

// Mood API calls - Complete implementation
export const moodApi = {
    // Add mood entry
    addMoodEntry: async (moodData: MoodData): Promise<ApiResponse<MoodEntry>> => {
        try {
            const response: AxiosResponse<ApiResponse<MoodEntry>> = await api.post('/mood/add', moodData);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to add mood entry';
            throw new Error(errorMessage);
        }
    },

    // Get mood entries for authenticated user
    getMoodEntries: async (params?: { startDate?: string; endDate?: string }): Promise<MoodEntry[]> => {
        try {
            const searchParams = new URLSearchParams();
            if (params?.startDate) searchParams.append('startDate', params.startDate);
            if (params?.endDate) searchParams.append('endDate', params.endDate);
            
            const queryString = searchParams.toString();
            const url = queryString ? `/mood?${queryString}` : '/mood';
            
            const response: AxiosResponse<MoodEntry[]> = await api.get(url);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch mood entries';
            throw new Error(errorMessage);
        }
    },

    // Get mood statistics for last 7 days
    getMoodStats: async (): Promise<MoodStats> => {
        try {
            const response: AxiosResponse<MoodStats> = await api.get('/mood/stats');
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch mood stats';
            throw new Error(errorMessage);
        }
    },

    // Get all moods with user info
    getAllMoods: async (): Promise<MoodEntry[]> => {
        try {
            const response: AxiosResponse<MoodEntry[]> = await api.get('/mood/get/all');
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch all moods';
            throw new Error(errorMessage);
        }
    },

    // Get mood entries for specific user
    getUserMoodEntries: async (
        userId: string, 
        params?: { startDate?: string; endDate?: string; limit?: number }
    ): Promise<{ user_id: string; total_entries: number; entries: MoodEntry[] }> => {
        try {
            const searchParams = new URLSearchParams();
            if (params?.startDate) searchParams.append('startDate', params.startDate);
            if (params?.endDate) searchParams.append('endDate', params.endDate);
            if (params?.limit) searchParams.append('limit', params.limit.toString());
            
            const queryString = searchParams.toString();
            const url = queryString ? `/mood/${userId}?${queryString}` : `/mood/${userId}`;
            
            const response = await api.get(url);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch user mood entries';
            throw new Error(errorMessage);
        }
    },

    // Legacy method for backward compatibility
    getMoodHistory: async (userId: string): Promise<{ user_id: string; total_entries: number; entries: MoodEntry[] }> => {
        try {
            const response = await api.get(`/mood/${userId}`);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch mood history';
            throw new Error(errorMessage);
        }
    },
};

// Entry API calls
export const entryApi = {
    addEntry: async (entryData: EntryData): Promise<ApiResponse<Entry>> => {
        try {
            const response: AxiosResponse<ApiResponse<Entry>> = await api.post('/entry', entryData);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to add entry';
            throw new Error(errorMessage);
        }
    },

    getEntries: async (userId: string): Promise<Entry[]> => {
        try {
            const response: AxiosResponse<Entry[]> = await api.get(`/entry/user/${userId}`);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch entries';
            throw new Error(errorMessage);
        }
    }
};

// Export the axios instance for direct use if needed
export default api;