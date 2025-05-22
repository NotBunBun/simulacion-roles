import React, { ReactNode } from 'react';
import { Container } from '@mui/material';
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ p: 0, mt: 4 }}>
        {children}
      </Container>
    </>
  );
}
