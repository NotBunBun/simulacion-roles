'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function Breadcrumbs() {
  const router = useRouter();
  const pathnames = router.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: Record<string, string> = {
    tipos: 'Tipos',
    propiedades: 'Propiedades',
  };

  if (router.pathname === '/') {
    return null; // No breadcrumbs on home page
  }

  return (
    <Box sx={{ py: 2, px: 3, backgroundColor: 'background.default' }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'secondary.light' }} />}
        aria-label="breadcrumb"
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#b55eff',
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Inicio
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = breadcrumbNameMap[value] || value;

          return last ? (
            <Typography key={to} color="text.primary">
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              href={to}
              style={{
                textDecoration: 'none',
                color: '#b55eff',
              }}
            >
              {label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}
