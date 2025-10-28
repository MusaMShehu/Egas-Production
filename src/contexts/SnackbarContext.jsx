// src/context/SnackbarContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    key: Date.now(),
  });

  const [queue, setQueue] = useState([]);

  const showSnackbar = useCallback((message, severity = 'success', duration = 4000) => {
    const newSnackbar = {
      message,
      severity,
      duration,
      key: Date.now(),
    };

    setQueue((prev) => [...prev, newSnackbar]);
  }, []);

  // Create convenience methods using showSnackbar
  const snackbarActions = {
    success: (message, duration) => showSnackbar(message, 'success', duration),
    error: (message, duration) => showSnackbar(message, 'error', duration),
    warning: (message, duration) => showSnackbar(message, 'warning', duration),
    info: (message, duration) => showSnackbar(message, 'info', duration),
  };

  const processQueue = useCallback(() => {
    if (queue.length > 0) {
      setSnackbar({
        ...queue[0],
        open: true,
      });
      setQueue((prev) => prev.slice(1));
    }
  }, [queue]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleExited = () => {
    processQueue();
  };

  // Combine all actions into one context value
  const contextValue = {
    showSnackbar,
    ...snackbarActions,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        key={snackbar.key}
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};