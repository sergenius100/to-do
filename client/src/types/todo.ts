export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  category?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  category?: string;
  tags?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  category?: string;
  tags?: string;
}

export interface TodoFilters {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  search?: string;
  due_date?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byCategory: Record<string, number>;
}

export interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  category: string;
  tags: string;
}