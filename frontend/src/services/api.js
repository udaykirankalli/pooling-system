import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const pollAPI = {
  createPoll: async (question, options, duration) => {
    try {
      const response = await api.post('/polls', { question, options, duration });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getActivePoll: async () => {
    try {
      const response = await api.get('/polls/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active poll:', error);
      return { poll: null };
    }
  },

  getPollHistory: async () => {
    try {
      const response = await api.get('/polls/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching poll history:', error);
      return [];
    }
  },

  submitVote: async (pollId, optionIndex, studentName, sessionId) => {
    try {
      const response = await api.post('/votes', {
        pollId,
        optionIndex,
        studentName,
        sessionId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};