'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { AuthContext } from '@/context/AuthContext';

export default function Navbar() {
  const { user, toggleRole } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { href: '/', label: 'Inicio', icon: <HomeIcon /> },
    { href: '/tipos', label: 'Tipos' },
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/productos', label: 'Productos' },
  ];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.href} disablePadding>
            <ListItemButton
              component={Link}
              href={link.href}
              onClick={handleDrawerToggle}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(110,0,204,0.1)',
                },
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  sx: { color: 'text.primary' },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ px: 2, mt: 2 }}>
        <Chip
          label={user.role === 'admin' ? 'Administrador' : 'Visualizador'}
          color="secondary"
          size="small"
          sx={{ mb: 1 }}
        />
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          fullWidth
          onClick={() => {
            toggleRole();
            handleDrawerToggle();
          }}
          startIcon={<SwapHorizIcon />}
        >
          Cambiar Rol
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: isMobile ? 1 : 0,
              textDecoration: 'none',
              color: 'inherit',
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 0 8px rgba(181,94,255,0.6)',
              mr: 4,
            }}
          >
            Fortex
          </Typography>

          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(110,0,204,0.2)',
                      },
                    }}
                    startIcon={link.icon}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={user.role === 'admin' ? 'Administrador' : 'Visualizador'}
                  color="secondary"
                  size="small"
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={toggleRole}
                  startIcon={<SwapHorizIcon />}
                >
                  Cambiar Rol
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Toolbar spacer to push content below the fixed AppBar */}
      <Toolbar />
    </>
  );
}
