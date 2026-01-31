/**
 * Build pagination object
 */
const buildPagination = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    
    return {
      currentPage: page,
      totalPages,
      totalRecords: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit,
    };
  };
  
  /**
   * Parse date string to Date object
   */
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };
  
  /**
   * Format number with commas
   */
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  };
  
  /**
   * Calculate percentage
   */
  const calculatePercentage = (amount, percentage) => {
    return amount - (amount * percentage / 100);
  };
  
  /**
   * Escape regex special characters for search
   */
  const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  export default {
    buildPagination,
    parseDate,
    formatNumber,
    calculatePercentage,
    escapeRegex,
  };