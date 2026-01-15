'use client';

import React, { ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface EmptyStateProps {
  icon: SvgIconComponent;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionButton,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        textAlign: 'center',
        p: 4,
      }}
    >
      <Icon
        sx={{
          fontSize: 80,
          color: 'secondary.light',
          mb: 2,
          opacity: 0.6,
        }}
      />
      <Typography variant="h4" gutterBottom sx={{ color: 'secondary.light' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 500 }}>
        {description}
      </Typography>
      {actionButton && (
        <Button
          variant="contained"
          color="secondary"
          onClick={actionButton.onClick}
          sx={{
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 0 12px rgba(110,0,204,0.6)',
            },
          }}
        >
          {actionButton.label}
        </Button>
      )}
    </Box>
  );
}
