/**
 * Pagination Utilities
 * Helper functions for client-side pagination
 */

/**
 * Calculate pagination metadata
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination metadata
 */
export const calculatePagination = (totalItems, currentPage = 1, itemsPerPage = 10) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  };
};

/**
 * Get page numbers to display in pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} maxVisible - Maximum page numbers to show
 * @returns {Array} Array of page numbers to display
 */
export const getPageNumbers = (currentPage, totalPages, maxVisible = 5) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

/**
 * Parse query parameters for pagination
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} Parsed pagination parameters
 */
export const parsePaginationParams = (searchParams) => {
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(100, limit)), // Max 100 items per page
  };
};

/**
 * Create query string for pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} filters - Additional filter parameters
 * @returns {string} Query string
 */
export const createPaginationQuery = (page, limit, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });

  return params.toString();
};

/**
 * Paginate array client-side
 * @param {Array} items - Array of items to paginate
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result
 */
export const paginateArray = (items, page = 1, limit = 10) => {
  const totalItems = items.length;
  const { startIndex, endIndex, ...pagination } = calculatePagination(totalItems, page, limit);
  
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    pagination: {
      ...pagination,
      startItem: startIndex + 1,
      endItem: endIndex,
    },
  };
};

export default {
  calculatePagination,
  getPageNumbers,
  parsePaginationParams,
  createPaginationQuery,
  paginateArray,
};
