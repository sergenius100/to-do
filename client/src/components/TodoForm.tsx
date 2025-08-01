import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { useTodoStore } from '../store/todoStore';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().optional(),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  tags: z.string().max(200, 'Tags must be less than 200 characters').optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  todo?: Todo;
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onClose }) => {
  const { createTodo, updateTodo } = useTodoStore();
  const isEditing = !!todo;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: todo ? {
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      due_date: todo.due_date || '',
      category: todo.category || '',
      tags: todo.tags || '',
    } : {
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      category: '',
      tags: '',
    },
  });

  const onSubmit = async (data: TodoFormData) => {
    try {
      if (isEditing && todo) {
        const updateData: UpdateTodoRequest = {
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          due_date: data.due_date || undefined,
          category: data.category || undefined,
          tags: data.tags || undefined,
        };
        await updateTodo(todo.id, updateData);
      } else {
        const createData: CreateTodoRequest = {
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          due_date: data.due_date || undefined,
          category: data.category || undefined,
          tags: data.tags || undefined,
        };
        await createTodo(createData);
      }
      
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to save todo:', error);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Todo' : 'Create New Todo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input
            label="Title"
            placeholder="What needs to be done?"
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Description"
            placeholder="Add more details (optional)"
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={priorityOptions}
              error={errors.priority?.message}
              {...register('priority')}
            />

            <Input
              label="Due Date"
              type="date"
              error={errors.due_date?.message}
              {...register('due_date')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              placeholder="Work, Personal, etc."
              error={errors.category?.message}
              {...register('category')}
            />

            <Input
              label="Tags"
              placeholder="tag1, tag2, tag3"
              error={errors.tags?.message}
              {...register('tags')}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
            >
              {isEditing ? 'Update Todo' : 'Create Todo'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TodoForm;