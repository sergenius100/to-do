import axios from 'axios';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters, TodoStats } from '../types/todo';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const todoApi = {
  // Get all todos with optional filters
  getTodos: async (filters?: TodoFilters): Promise<Todo[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/todos?${params.toString()}`);
    return response.data;
  },

  // Get a single todo by ID
  getTodo: async (id: string): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Create a new todo
  createTodo: async (todoData: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  // Update a todo
  updateTodo: async (id: string, todoData: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Toggle todo completion status
  toggleTodo: async (id: string, completed: boolean): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, { completed });
    return response.data;
  },

  // Get todo statistics
  getStats: async (): Promise<TodoStats> => {
    const response = await api.get('/todos/stats/overview');
    return response.data;
  },
};

export default api;