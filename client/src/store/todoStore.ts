import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Todo, TodoFilters, TodoStats, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { todoApi } from '../lib/api';
import toast from 'react-hot-toast';

interface TodoState {
  todos: Todo[];
  stats: TodoStats | null;
  filters: TodoFilters;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTodos: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createTodo: (todoData: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, todoData: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  setFilters: (filters: Partial<TodoFilters>) => void;
  clearError: () => void;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    (set, get) => ({
      todos: [],
      stats: null,
      filters: {},
      loading: false,
      error: null,

      fetchTodos: async () => {
        try {
          set({ loading: true, error: null });
          const todos = await todoApi.getTodos(get().filters);
          set({ todos, loading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch todos';
          set({ error: message, loading: false });
          toast.error(message);
        }
      },

      fetchStats: async () => {
        try {
          const stats = await todoApi.getStats();
          set({ stats });
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      },

      createTodo: async (todoData: CreateTodoRequest) => {
        try {
          set({ loading: true, error: null });
          const newTodo = await todoApi.createTodo(todoData);
          set((state) => ({
            todos: [newTodo, ...state.todos],
            loading: false
          }));
          toast.success('Todo created successfully!');
          get().fetchStats();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create todo';
          set({ error: message, loading: false });
          toast.error(message);
        }
      },

      updateTodo: async (id: string, todoData: UpdateTodoRequest) => {
        try {
          set({ loading: true, error: null });
          const updatedTodo = await todoApi.updateTodo(id, todoData);
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? updatedTodo : todo
            ),
            loading: false
          }));
          toast.success('Todo updated successfully!');
          get().fetchStats();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update todo';
          set({ error: message, loading: false });
          toast.error(message);
        }
      },

      deleteTodo: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await todoApi.deleteTodo(id);
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
            loading: false
          }));
          toast.success('Todo deleted successfully!');
          get().fetchStats();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete todo';
          set({ error: message, loading: false });
          toast.error(message);
        }
      },

      toggleTodo: async (id: string, completed: boolean) => {
        try {
          const updatedTodo = await todoApi.toggleTodo(id, completed);
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? updatedTodo : todo
            )
          }));
          get().fetchStats();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to toggle todo';
          set({ error: message });
          toast.error(message);
        }
      },

      setFilters: (filters: Partial<TodoFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }));
        get().fetchTodos();
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'todo-store',
    }
  )
);