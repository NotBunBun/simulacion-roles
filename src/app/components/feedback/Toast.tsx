'use client';

import React, { useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { NotificationContext } from '@/context/NotificationContext';

export default function Toast() {
  const { toasts, hideToast } = useContext(NotificationContext);

  return (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => hideToast(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: toasts.indexOf(toast) * 8 }}
        >
          <Alert
            onClose={() => hideToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{
              width: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
