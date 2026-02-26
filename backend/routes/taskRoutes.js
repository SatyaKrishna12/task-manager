const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  bulkDeleteTasks,
  bulkUpdateStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const {
  validate,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  objectIdSchema,
} = require('../middleware/validateMiddleware');

/**
 * All routes are protected (require authentication)
 */
router.use(protect);

/**
 * Task Statistics Routes
 */

// @route   GET /api/tasks/stats
// @desc    Get task statistics for logged-in user
// @access  Private
router.get('/stats', getTaskStats);

/**
 * Bulk Operations Routes
 */

// @route   DELETE /api/tasks/bulk
// @desc    Bulk delete tasks
// @access  Private
router.delete('/bulk', bulkDeleteTasks);

// @route   PATCH /api/tasks/bulk/status
// @desc    Bulk update task status
// @access  Private
router.patch('/bulk/status', bulkUpdateStatus);

/**
 * Main Task Routes
 */

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user (with pagination, filtering, search)
// @access  Private
router.get('/', validate(taskQuerySchema, 'query'), getTasks);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', validate(createTaskSchema), createTask);

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Private
router.get('/:id', validate(objectIdSchema, 'params'), getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put(
  '/:id',
  validate(objectIdSchema, 'params'),
  validate(updateTaskSchema),
  updateTask
);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', validate(objectIdSchema, 'params'), deleteTask);

module.exports = router;
