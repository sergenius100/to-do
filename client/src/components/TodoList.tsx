import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Todo } from '../types/todo';
import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import Button from './ui/Button';

const TodoList: React.FC = () => {
  const { todos, loading, error } = useTodoStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(undefined);
  };

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">
            {todos.length} total • {pendingTodos.length} pending • {completedTodos.length} completed
          </p>
        </div>
        
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Todo
        </Button>
      </div>

      {/* Todo Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TodoForm
            todo={editingTodo}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>

      {/* Empty State */}
      {todos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PlusIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first todo!</p>
          <Button onClick={() => setShowForm(true)}>
            Create Your First Todo
          </Button>
        </motion.div>
      )}

      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {pendingTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TodoItem todo={todo} onEdit={handleEdit} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Completed Tasks</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TodoItem todo={todo} onEdit={handleEdit} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;