const Task = require('../models/Task');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { parsePaginationParams, createPaginationMeta, buildSearchFilter, buildSort } = require('../utils/pagination');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    dueDate,
    userId: req.user._id, // Attach task to logged-in user
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

/**
 * @desc    Get all tasks for logged-in user
 * @route   GET /api/tasks
 * @access  Private
 * @query   page, limit, status, priority, search, sortBy
 */
const getTasks = asyncHandler(async (req, res) => {
  // Parse pagination parameters
  const { page, limit, skip } = parsePaginationParams(req.query);

  // Build filter object
  const filter = { userId: req.user._id };

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by priority
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  // Search in title and description
  if (req.query.search) {
    const searchFilter = buildSearchFilter(req.query.search, ['title', 'description']);
    Object.assign(filter, searchFilter);
  }

  // Build sort object
  const sort = buildSort(req.query.sortBy, { createdAt: -1 });

  // Execute query with pagination
  const [tasks, totalDocs] = await Promise.all([
    Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Task.countDocuments(filter),
  ]);

  // Create pagination metadata
  const pagination = createPaginationMeta(page, limit, totalDocs);

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
    pagination,
  });
});

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Ensure task belongs to logged-in user
  if (task.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this task',
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Ensure task belongs to logged-in user
  if (task.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task',
    });
  }

  // Update allowed fields
  const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Update task
  task = await Task.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true, // Return updated document
      runValidators: true, // Run model validators
    }
  );

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Ensure task belongs to logged-in user
  if (task.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this task',
    });
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {},
  });
});

/**
 * @desc    Get task statistics for logged-in user
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Calculate overdue tasks
  const overdueTasks = await Task.countDocuments({
    userId: req.user._id,
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' },
  });

  const result = {
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
    overdue: overdueTasks,
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Bulk delete tasks
 * @route   DELETE /api/tasks/bulk
 * @access  Private
 */
const bulkDeleteTasks = asyncHandler(async (req, res) => {
  const { taskIds } = req.body;

  if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of task IDs',
    });
  }

  // Delete only tasks that belong to the user
  const result = await Task.deleteMany({
    _id: { $in: taskIds },
    userId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} task(s) deleted successfully`,
    data: {
      deletedCount: result.deletedCount,
    },
  });
});

/**
 * @desc    Bulk update task status
 * @route   PATCH /api/tasks/bulk/status
 * @access  Private
 */
const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const { taskIds, status } = req.body;

  if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of task IDs',
    });
  }

  if (!status || !['pending', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid status (pending, in-progress, or completed)',
    });
  }

  // Update only tasks that belong to the user
  const result = await Task.updateMany(
    {
      _id: { $in: taskIds },
      userId: req.user._id,
    },
    {
      status,
      ...(status === 'completed' && { completedAt: new Date() }),
    }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} task(s) updated successfully`,
    data: {
      modifiedCount: result.modifiedCount,
    },
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  bulkDeleteTasks,
  bulkUpdateStatus,
};
