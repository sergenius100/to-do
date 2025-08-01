import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { TodoFilters } from '../types/todo';
import { useTodoStore } from '../store/todoStore';
import { debounce } from '../lib/utils';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

const TodoFiltersComponent: React.FC = () => {
  const { filters, setFilters } = useTodoStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const debouncedSearch = debounce((value: string) => {
    setFilters({ search: value });
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (key: keyof TodoFilters, value: string | boolean | undefined) => {
    setFilters({ [key]: value });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'false', label: 'Pending' },
    { value: 'true', label: 'Completed' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-soft">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search todos..."
            defaultValue={filters.search || ''}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <FunnelIcon className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {Object.keys(filters).filter(key => filters[key as keyof TodoFilters] !== undefined && filters[key as keyof TodoFilters] !== '').length}
            </span>
          )}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Status"
                options={statusOptions}
                value={filters.completed?.toString() || ''}
                onChange={(value) => handleFilterChange('completed', value === '' ? undefined : value === 'true')}
              />

              <Select
                label="Priority"
                options={priorityOptions}
                value={filters.priority || ''}
                onChange={(value) => handleFilterChange('priority', value === '' ? undefined : value as any)}
              />

              <Input
                label="Category"
                placeholder="Filter by category"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default TodoFiltersComponent;