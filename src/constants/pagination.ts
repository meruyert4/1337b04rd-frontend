// Pagination constants for the application
export const PAGINATION = {
  // Posts pagination
  POSTS_PER_PAGE: 10,
  TOTAL_POSTS_LIMIT: 1000, // Increased to 100 to show all posts
  
  // Characters pagination (for home page)
  CHARACTERS_PER_PAGE: 6,
  
  // Default page
  DEFAULT_PAGE: 1,
  DEFAULT_OFFSET: 0,
} as const;

// Helper functions for pagination
export const getOffsetFromPage = (page: number, itemsPerPage: number): number => {
  return (page - 1) * itemsPerPage;
};

export const getPageFromOffset = (offset: number, itemsPerPage: number): number => {
  return Math.floor(offset / itemsPerPage) + 1;
};

export const getTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};
