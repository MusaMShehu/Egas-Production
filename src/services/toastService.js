import { toast } from 'react-toastify';

class ToastService {
  // Extract message from various backend response formats
  extractMessage = (response) => {
    if (!response) return 'No response from server';

    // Handle different backend response structures
    if (typeof response === 'string') return response;
    
    if (response.data) {
      // Axios response format
      if (typeof response.data === 'string') return response.data;
      if (response.data.message) return response.data.message;
      if (response.data.error) return response.data.error;
      if (response.data.detail) return response.data.detail;
    }
    
    if (response.message) return response.message;
    if (response.error) return response.error;
    if (response.detail) return response.detail;
    
    return 'Operation completed';
  };

  // Extract error message from various error formats
  extractErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';

    // Handle different error structures
    if (typeof error === 'string') return error;
    
    if (error.response) {
      // Axios error response
      const { data, status, statusText } = error.response;
      
      if (data) {
        if (typeof data === 'string') return data;
        if (data.message) return data.message;
        if (data.error) return data.error;
        if (data.detail) return data.detail;
        if (data.errors) {
          // Handle validation errors array
          return this.formatValidationErrors(data.errors);
        }
      }
      
      return statusText || `Error ${status}`;
    }
    
    if (error.message) return error.message;
    if (error.error) return error.error;
    
    return 'An unexpected error occurred';
  };

  // Format validation errors from backend
  formatValidationErrors = (errors) => {
    if (Array.isArray(errors)) {
      return errors.join(', ');
    }
    
    if (typeof errors === 'object') {
      return Object.values(errors).flat().join(', ');
    }
    
    return String(errors);
  };

  // Show success message from backend response
  showSuccess = (response, customMessage = null) => {
    const message = customMessage || this.extractMessage(response);
    return toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Show error message from backend error
  showError = (error, customMessage = null) => {
    const message = customMessage || this.extractErrorMessage(error);
    return toast.error(message, {
      position: "top-right",
      autoClose: 7000, // Longer display for errors
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Handle API response - automatically shows success/error
  handleApiResponse = (promise, options = {}) => {
    const {
      successMessage = null,
      errorMessage = null,
      showSuccess = true,
      showError = true,
    } = options;

    return promise
      .then((response) => {
        if (showSuccess) {
          this.showSuccess(response, successMessage);
        }
        return response;
      })
      .catch((error) => {
        if (showError) {
          this.showError(error, errorMessage);
        }
        throw error;
      });
  };

  // Handle async operation with loading state
  handleAsyncOperation = async (operation, options = {}) => {
    const {
      loadingMessage = 'Processing...',
      successMessage = null,
      errorMessage = null,
    } = options;

    const toastId = toast.loading(loadingMessage);

    try {
      const result = await operation();
      
      toast.update(toastId, {
        render: successMessage || this.extractMessage(result),
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      });
      
      return result;
    } catch (error) {
      toast.update(toastId, {
        render: errorMessage || this.extractErrorMessage(error),
        type: 'error',
        isLoading: false,
        autoClose: 7000,
      });
      throw error;
    }
  };
}

export const toastService = new ToastService();