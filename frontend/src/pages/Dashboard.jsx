import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

/**
 * Dashboard Page Component
 * Main page for managing tasks with filters, search, and pagination
 */
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    limit: 10,
  });
  
  // Filters and Search
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
  });

  /**
   * Fetch tasks with filters and pagination
   */
  const fetchTasks = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await api.get('/tasks', { params });
      const fetchedTasks = response.data.data;
      const paginationData = response.data.pagination;

      setTasks(fetchedTasks);
      setPagination({
        currentPage: paginationData.currentPage,
        totalPages: paginationData.totalPages,
        totalTasks: paginationData.totalTasks,
        limit: paginationData.limit,
      });
    } catch (error) {
      // Error handled by axios interceptor
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch task statistics
   */
  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/stats');
      setStats(response.data.data);
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  /**
   * Initial load and when filters change
   */
  useEffect(() => {
    fetchTasks(1);
    fetchStats();
  }, [filters]);

  /**
   * Handle task created
   */
  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
    fetchStats();
  };

  /**
   * Handle task updated
   */
  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    fetchStats();
  };

  /**
   * Handle task deleted
   */
  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
    fetchStats();
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      search: '',
    });
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage) => {
    fetchTasks(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-gray-500 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats['in-progress']}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
          </div>
        </div>

        {/* Task Form */}
        <TaskForm onTaskCreated={handleTaskCreated} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="input cursor-pointer"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.search || filters.status || filters.priority) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-2 text-gray-500">
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your filters'
                : 'Get started by creating a new task'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdate={handleTaskUpdated}
                  onDelete={handleTaskDeleted}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing page {pagination.currentPage} of {pagination.totalPages}
                    {' '}({pagination.totalTasks} total tasks)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
