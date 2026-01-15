'use client';

import React, { useContext } from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { NotificationContext } from '@/context/NotificationContext';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  const { loading } = useContext(NotificationContext);

  return (
    <Backdrop
      sx={{
        color: '#b55eff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={loading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress
          color="secondary"
          size={60}
          thickness={4}
          sx={{
            boxShadow: '0 0 24px rgba(110,0,204,0.8)',
          }}
        />
        {message && (
          <Typography variant="h5" sx={{ textShadow: '0 0 8px rgba(110,0,204,0.6)' }}>
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
}
