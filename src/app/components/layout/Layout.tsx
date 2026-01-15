import React, { ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Toast from '../feedback/Toast';
import ConfirmDialog from '../feedback/ConfirmDialog';
import LoadingSpinner from '../feedback/LoadingSpinner';
import { NotificationProvider } from '@/context/NotificationContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <NotificationProvider>
      <Navbar />
      <Breadcrumbs />
      <Container disableGutters maxWidth={false} sx={{ p: 0, minHeight: 'calc(100vh - 120px)' }}>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
          {children}
        </Box>
      </Container>
      <Toast />
      <ConfirmDialog />
      <LoadingSpinner />
    </NotificationProvider>
  );
}
