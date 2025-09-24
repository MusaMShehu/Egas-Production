// utils/helpers.js
export const formatDate = (dateString, includeTime = false) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const getStatusClass = (status) => {
  switch(status) {
    case 'processing':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
    case 'delivered':
    case 'active':
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getNextMonthDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
};