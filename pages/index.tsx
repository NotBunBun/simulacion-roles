'use client'

import NextLink from 'next/link'
import { useContext } from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import { AuthContext } from '../src/app/context/AuthContext'

export default function HomePage() {
  const { user, toggleRole } = useContext(AuthContext)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: '#0e0220',
          p: { xs: 3, sm: 6 },
          borderRadius: 2,
          textAlign: 'center',
          maxWidth: { xs: '90%', sm: '70%', md: 480 },
          boxShadow: '0 0 16px rgba(142,0,204,0.4)',
        }}
      >
        <Typography
          variant="h1"
          color="secondary.main"
          gutterBottom
          sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
            mb: { xs: 2, sm: 3 },
          }}
        >
          Simulación Roles
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem' },
            mb: 3,
          }}
        >
          Rol actual: <strong>{user.role}</strong>
        </Typography>

        <Button
          variant="outlined"
          color="secondary"
          onClick={toggleRole}
          sx={{
            mb: 3,
            px: 4,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 0 16px rgba(181,94,255,0.8)',
            },
          }}
        >
          Cambiar Rol
        </Button>

        <Stack spacing={2} sx={{ width: '100%' }}>
          <Button
            component={NextLink}
            href="/tipos"
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            sx={{
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 0 16px rgba(181,94,255,0.8)',
              },
            }}
          >
            Administración de Tipos
          </Button>

          <Button
            component={NextLink}
            href="/propiedades"
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            sx={{
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 0 16px rgba(181,94,255,0.8)',
              },
            }}
          >
            Administración de Propiedades
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
