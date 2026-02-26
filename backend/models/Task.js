const mongoose = require('mongoose');

/**
 * Task Schema
 * Manages user tasks with status tracking
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a task description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be either pending, in-progress, or completed',
      },
      default: 'pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true, // Index for faster queries
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

/**
 * Pre-save middleware to set completedAt when status changes to completed
 */
taskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Clear completedAt if status is changed from completed
  if (this.isModified('status') && this.status !== 'completed') {
    this.completedAt = undefined;
  }
  
  next();
});

/**
 * Instance method to check if task is overdue
 * @returns {boolean} - True if task is overdue
 */
taskSchema.methods.isOverdue = function () {
  if (!this.dueDate || this.status === 'completed') {
    return false;
  }
  return new Date() > this.dueDate;
};

/**
 * Static method to get user's task statistics
 * @param {ObjectId} userId - User ID
 * @returns {object} - Task statistics
 */
taskSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};

// Compound indexes for optimized queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text' }); // Text search index

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
