import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { TodoStats } from '../types/todo';

interface TodoStatsProps {
  stats: TodoStats;
}

const TodoStats: React.FC<TodoStatsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
  ];

  const priorityItems = [
    { label: 'High', count: stats.byPriority.high, color: 'bg-red-100 text-red-800' },
    { label: 'Medium', count: stats.byPriority.medium, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Low', count: stats.byPriority.low, color: 'bg-green-100 text-green-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
        <div className="space-y-3">
          {priorityItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                  <div
                    className={`h-2 rounded-full ${item.color.split(' ')[0]}`}
                    style={{
                      width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${item.color}`}>
                  {item.count}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.byCategory).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-3">
            {Object.entries(stats.byCategory).map(([category, count], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                  {count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoStats;