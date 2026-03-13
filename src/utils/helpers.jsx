// // utils/helpers.js
// // Helper function to format dates
// export const formatDate = (dateString, includeTime = false) => {
//   const options = { 
//     year: 'numeric', 
//     month: 'short', 
//     day: 'numeric',
//     ...(includeTime && { hour: '2-digit', minute: '2-digit' })
//   };
//   return new Date(dateString).toLocaleDateString('en-US', options);
// };

// // Helper function to get status class
// export const getStatusClass = (status) => {
//   switch(status) {
//     case 'processing':
//     case 'pending':
//       return 'bg-yellow-100 text-yellow-800';
//     case 'completed':
//     case 'delivered':
//     case 'active':
//     case 'resolved':
//       return 'bg-green-100 text-green-800';
//     case 'cancelled':
//     case 'failed':
//       return 'bg-red-100 text-red-800';
//     default:
//       return 'bg-gray-100 text-gray-800';
//   }
// };

// // Helper function to get next month's date
// export const getNextMonthDate = () => {
//   const date = new Date();
//   date.setMonth(date.getMonth() + 1);
//   return date.toISOString().split('T')[0];
// };


// utils/helpers.js

/**
 * ============================================
 * DATE AND TIME FORMATTING
 * ============================================
 */

/**
 * Format date to readable string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };

    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date with time (wrapper for backward compatibility)
 */
export const formatDateWithTime = (dateString, includeTime = false) => {
  if (includeTime) {
    return formatDateTime(dateString);
  }
  return formatDate(dateString);
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateString);
};

/**
 * Get next month's date
 */
export const getNextMonthDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
};

/**
 * ============================================
 * CURRENCY AND NUMBER FORMATTING
 * ============================================
 */

/**
 * Format currency to Nigerian Naira
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₦0';
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * ============================================
 * TEXT FORMATTING
 * ============================================
 */

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get status text for display (capitalized)
 */
export const getStatusText = (status) => {
  if (!status) return 'Unknown';
  
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get payment method display name
 */
export const getPaymentMethodName = (method) => {
  const methodMap = {
    card: 'Credit/Debit Card',
    bank_transfer: 'Bank Transfer',
    ussd: 'USSD',
    wallet: 'Wallet Balance',
    paystack: 'Paystack',
    auto_debit: 'Auto-Debit'
  };

  return methodMap[method?.toLowerCase()] || method || 'Unknown';
};

/**
 * ============================================
 * STATUS STYLING
 * ============================================
 */

/**
 * Get status class for styling (CSS classes)
 */
export const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const normalizedStatus = status.toLowerCase();
  
  // Tailwind CSS classes
  switch(normalizedStatus) {
    // Processing/Pending states
    case 'processing':
    case 'pending':
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    
    // Success states
    case 'completed':
    case 'delivered':
    case 'active':
    case 'resolved':
    case 'success':
    case 'credit':
      return 'bg-green-100 text-green-800';
    
    // Error states
    case 'cancelled':
    case 'failed':
    case 'expired':
    case 'error':
      return 'bg-red-100 text-red-800';
    
    // Info states
    case 'in-transit':
    case 'debit':
    case 'info':
      return 'bg-blue-100 text-blue-800';
    
    // Warning states
    case 'warning':
      return 'bg-orange-100 text-orange-800';
    
    // Default
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get status class for styling (alternative with semantic class names)
 */
export const getStatusClassSemantic = (status) => {
  const statusMap = {
    // Order statuses
    pending: 'status-pending',
    processing: 'status-processing',
    'in-transit': 'status-info',
    delivered: 'status-success',
    cancelled: 'status-error',
    failed: 'status-error',
    
    // Subscription statuses
    active: 'status-success',
    paused: 'status-warning',
    expired: 'status-error',
    
    // Payment statuses
    completed: 'status-success',
    credit: 'status-success',
    debit: 'status-info'
  };

  return statusMap[status?.toLowerCase()] || 'status-default';
};

/**
 * ============================================
 * FILE HANDLING
 * ============================================
 */

/**
 * Get file icon based on type
 */
export const getFileIcon = (filename) => {
  if (!filename) return '📄';
  
  const ext = filename.split('.').pop().toLowerCase();
  
  const iconMap = {
    // Images
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🎨',
    webp: '🖼️',
    
    // Documents
    pdf: '📕',
    doc: '📘',
    docx: '📘',
    txt: '📄',
    
    // Data
    csv: '📊',
    xls: '📊',
    xlsx: '📊',
    
    // Archives
    zip: '🗜️',
    rar: '🗜️',
    
    // Code
    js: '📜',
    jsx: '📜',
    ts: '📜',
    tsx: '📜',
    json: '📋',
    html: '🌐',
    css: '🎨'
  };

  return iconMap[ext] || '📎';
};

/**
 * Download file from blob
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for rate limiting
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

