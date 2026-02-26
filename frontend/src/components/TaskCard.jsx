import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

/**
 * TaskCard Component
 * Displays a single task with edit, delete, and status update functionality
 *
 * @param {Object} props
 * @param {Object} props.task - Task object
 * @param {Function} props.onUpdate - Callback when task is updated
 * @param {Function} props.onDelete - Callback when task is deleted
 */
const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Status badge colors
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  // Priority badge colors
  const priorityColors = {
    low: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  /**
   * Handle task update
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put(`/tasks/${task._id}`, editData);
      toast.success('Task updated successfully');
      onUpdate(response.data.data);
      setIsEditing(false);
    } catch (error) {
      // Error handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle task deletion
   */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted successfully');
      onDelete(task._id);
    } catch (error) {
      // Error handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Quick status update
   */
  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/tasks/${task._id}`, { status: newStatus });
      toast.success('Status updated');
      onUpdate(response.data.data);
    } catch (error) {
      // Error handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Mode
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleUpdate}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="input"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="input cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                  className="input cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // View Mode
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500">Status:</span>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isLoading}
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]} border-0 cursor-pointer hover:opacity-80 transition-opacity`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors cursor-pointer"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
