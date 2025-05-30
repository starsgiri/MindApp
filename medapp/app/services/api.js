import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API calls
export const authApi = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Registration failed');
        }
    },

    getProfile: async (userId) => {
        try {
            const response = await api.get(`/auth/profile/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch profile');
        }
    },
};

// Mood API calls
export const moodApi = {
    addMoodEntry: async (moodData) => {
        try {
            const response = await api.post('/mood', moodData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to add mood entry');
        }
    },

    getMoodHistory: async (userId) => {
        try {
            const response = await api.get(`/mood/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch mood history');
        }
    },

    getMoodStats: async () => {
        try {
            const response = await api.get('/mood/stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch mood stats');
        }
    },
};

// Entry API calls
export const entryApi = {
    addEntry: async (entryData) => {
        try {
            const response = await api.post('/entry', entryData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to add entry');
        }
    },

    getEntries: async (userId) => {
        try {
            const response = await api.get(`/entry/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch entries');
        }
    }
};
