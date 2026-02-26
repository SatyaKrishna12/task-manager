/**
 * Pagination Utility
 * Provides consistent pagination across all list endpoints
 */

/**
 * Parse and validate pagination parameters from request query
 * @param {object} query - Express request query object
 * @returns {object} - Parsed pagination parameters
 */
const parsePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Create pagination metadata for response
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalDocs - Total number of documents
 * @returns {object} - Pagination metadata
 */
const createPaginationMeta = (page, limit, totalDocs) => {
  const totalPages = Math.ceil(totalDocs / limit);
  
  return {
    currentPage: page,
    totalPages,
    pageSize: limit,
    totalItems: totalDocs,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

/**
 * Execute paginated query with metadata
 * @param {object} model - Mongoose model
 * @param {object} query - Query conditions
 * @param {object} options - Pagination and query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {object} options.sort - Sort criteria
 * @param {string} options.populate - Fields to populate
 * @param {object} options.select - Fields to select/exclude
 * @returns {object} - Paginated results with metadata
 */
const paginate = async (model, query = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 }, populate = '', select = '' } = options;

  const skip = (page - 1) * limit;

  // Execute query with pagination
  const [data, totalDocs] = await Promise.all([
    model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate)
      .select(select)
      .lean(), // Use lean() for better performance
    model.countDocuments(query),
  ]);

  const pagination = createPaginationMeta(page, limit, totalDocs);

  return {
    success: true,
    data,
    pagination,
  };
};

/**
 * Build filter object from query parameters
 * @param {object} query - Express request query object
 * @param {array} allowedFilters - Array of allowed filter field names
 * @returns {object} - MongoDB filter object
 */
const buildFilter = (query, allowedFilters = []) => {
  const filter = {};

  allowedFilters.forEach((field) => {
    if (query[field] !== undefined && query[field] !== '') {
      filter[field] = query[field];
    }
  });

  return filter;
};

/**
 * Build search filter for text fields
 * @param {string} searchTerm - Search term
 * @param {array} fields - Fields to search in
 * @returns {object} - MongoDB $or filter object
 */
const buildSearchFilter = (searchTerm, fields = []) => {
  if (!searchTerm || fields.length === 0) {
    return {};
  }

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' }, // Case-insensitive search
    })),
  };
};

/**
 * Build sort object from query parameter
 * @param {string} sortParam - Sort parameter (e.g., 'createdAt', '-createdAt')
 * @param {object} defaultSort - Default sort object
 * @returns {object} - MongoDB sort object
 */
const buildSort = (sortParam, defaultSort = { createdAt: -1 }) => {
  if (!sortParam) {
    return defaultSort;
  }

  const sort = {};
  const fields = sortParam.split(',');

  fields.forEach((field) => {
    if (field.startsWith('-')) {
      sort[field.substring(1)] = -1; // Descending
    } else {
      sort[field] = 1; // Ascending
    }
  });

  return sort;
};

module.exports = {
  parsePaginationParams,
  createPaginationMeta,
  paginate,
  buildFilter,
  buildSearchFilter,
  buildSort,
};
