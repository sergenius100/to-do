import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ListBulletIcon, 
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useTodoStore } from './store/todoStore';
import TodoList from './components/TodoList';
import TodoStats from './components/TodoStats';
import TodoFilters from './components/TodoFilters';

const App: React.FC = () => {
  const { fetchTodos, fetchStats, stats } = useTodoStore();
  const [activeTab, setActiveTab] = useState('todos');
  const location = useLocation();

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [fetchTodos, fetchStats]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('todos');
    else if (path === '/stats') setActiveTab('stats');
  }, [location]);

  const tabs = [
    { id: 'todos', name: 'Tasks', icon: ListBulletIcon, path: '/' },
    { id: 'stats', name: 'Analytics', icon: ChartBarIcon, path: '/stats' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Todo App</h1>
            </div>
            
            <nav className="flex items-center space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  key="todos"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <TodoFilters />
                  <TodoList />
                </motion.div>
              }
            />
            
            <Route
              path="/stats"
              element={
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
                    <p className="text-gray-600">Track your productivity and task completion</p>
                  </div>
                  
                  {stats && <TodoStats stats={stats} />}
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2024 Modern Todo App. Built with React, TypeScript, and Tailwind CSS.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Made with ❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;