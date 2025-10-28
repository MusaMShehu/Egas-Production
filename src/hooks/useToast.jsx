import { useCallback } from 'react';
import { toastService } from '../services/toastService';

export const useBackendToast = () => {
  const showSuccess = useCallback((response, customMessage = null) => {
    return toastService.showSuccess(response, customMessage);
  }, []);

  const showError = useCallback((error, customMessage = null) => {
    return toastService.showError(error, customMessage);
  }, []);

  const handleApiCall = useCallback((apiCall, options = {}) => {
    return toastService.handleApiResponse(apiCall(), options);
  }, []);

  const handleAsyncOperation = useCallback((operation, options = {}) => {
    return toastService.handleAsyncOperation(operation, options);
  }, []);

  // Specific handlers for common backend operations
  const handleCreate = useCallback((apiCall, entityName = 'Item') => {
    return handleAsyncOperation(apiCall, {
      loadingMessage: `Creating ${entityName}...`,
      successMessage: `${entityName} created successfully!`,
      errorMessage: `Failed to create ${entityName}`,
    });
  }, [handleAsyncOperation]);

  const handleUpdate = useCallback((apiCall, entityName = 'Item') => {
    return handleAsyncOperation(apiCall, {
      loadingMessage: `Updating ${entityName}...`,
      successMessage: `${entityName} updated successfully!`,
      errorMessage: `Failed to update ${entityName}`,
    });
  }, [handleAsyncOperation]);

  const handleDelete = useCallback((apiCall, entityName = 'Item') => {
    return handleAsyncOperation(apiCall, {
      loadingMessage: `Deleting ${entityName}...`,
      successMessage: `${entityName} deleted successfully!`,
      errorMessage: `Failed to delete ${entityName}`,
    });
  }, [handleAsyncOperation]);

  const handleFetch = useCallback((apiCall, entityName = 'Data') => {
    return handleAsyncOperation(apiCall, {
      loadingMessage: `Loading ${entityName}...`,
      successMessage: `${entityName} loaded successfully!`,
      errorMessage: `Failed to load ${entityName}`,
    });
  }, [handleAsyncOperation]);

  return {
    showSuccess,
    showError,
    handleApiCall,
    handleAsyncOperation,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleFetch,
  };
};