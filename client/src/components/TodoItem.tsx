import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  TrashIcon, 
  PencilIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { Todo } from '../types/todo';
import { formatDate, getPriorityColor, getPriorityIcon, isOverdue, truncateText } from '../lib/utils';
import { useTodoStore } from '../store/todoStore';
import Button from './ui/Button';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { toggleTodo, deleteTodo } = useTodoStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    await toggleTodo(todo.id, !todo.completed);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTodo(todo.id);
  };

  const isOverdueTodo = todo.due_date && isOverdue(todo.due_date);

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.2 }}
          className="group relative bg-white rounded-xl border border-gray-200 p-4 shadow-soft hover:shadow-medium transition-all duration-200"
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={handleToggle}
              className="flex-shrink-0 mt-1"
            >
              {todo.completed ? (
                <CheckCircleSolidIcon className="h-6 w-6 text-green-500 hover:text-green-600 transition-colors" />
              ) : (
                <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-gray-500 transition-colors" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "text-sm font-medium leading-5",
                    todo.completed ? "text-gray-500 line-through" : "text-gray-900"
                  )}>
                    {todo.title}
                  </h3>
                  
                  {todo.description && (
                    <p className={cn(
                      "mt-1 text-sm",
                      todo.completed ? "text-gray-400" : "text-gray-600"
                    )}>
                      {truncateText(todo.description, 100)}
                    </p>
                  )}

                  {/* Meta information */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {/* Priority */}
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full border",
                      getPriorityColor(todo.priority)
                    )}>
                      <span>{getPriorityIcon(todo.priority)}</span>
                      {todo.priority}
                    </span>

                    {/* Due date */}
                    {todo.due_date && (
                      <span className={cn(
                        "inline-flex items-center gap-1",
                        isOverdueTodo && !todo.completed ? "text-red-600" : ""
                      )}>
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(todo.due_date)}
                        {isOverdueTodo && !todo.completed && (
                          <span className="text-red-600 font-medium"> (Overdue)</span>
                        )}
                      </span>
                    )}

                    {/* Category */}
                    {todo.category && (
                      <span className="inline-flex items-center gap-1">
                        <TagIcon className="h-3 w-3" />
                        {todo.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(todo)}
                    className="h-8 w-8 p-0"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default TodoItem;