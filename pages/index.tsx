'use client';

import NextLink from 'next/link';
import { useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AuthContext } from '../src/app/context/AuthContext';

export default function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(135deg, #b55eff 0%, #6e00cc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Bienvenido a Fortex
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            mb: 2,
          }}
        >
          Sistema de gestión de tipos, propiedades y productos
        </Typography>
        <Chip
          label={`Rol: ${user.role === 'admin' ? 'Administrador' : 'Visualizador'}`}
          color="secondary"
          sx={{ fontWeight: 500 }}
        />
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'rgba(110, 0, 204, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'secondary.main',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(110, 0, 204, 0.3)',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'rgba(110, 0, 204, 0.1)',
                  mb: 2,
                }}
              >
                <FolderIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Gestión de Tipos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administra y organiza los diferentes tipos de tu catálogo
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                component={NextLink}
                href="/tipos"
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                Ir a Tipos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'rgba(110, 0, 204, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'secondary.main',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(110, 0, 204, 0.3)',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'rgba(110, 0, 204, 0.1)',
                  mb: 2,
                }}
              >
                <ListAltIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Gestión de Propiedades
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea y gestiona las propiedades de tus elementos
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                component={NextLink}
                href="/propiedades"
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                Ir a Propiedades
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'rgba(110, 0, 204, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'secondary.main',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(110, 0, 204, 0.3)',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'rgba(110, 0, 204, 0.1)',
                  mb: 2,
                }}
              >
                <InventoryIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Gestión de Productos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administra tu inventario de productos con propiedades dinámicas
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                component={NextLink}
                href="/productos"
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                Ir a Productos
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {user.role === 'admin' && (
        <Box
          sx={{
            mt: 6,
            p: 3,
            bgcolor: 'rgba(110, 0, 204, 0.05)',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'secondary.main',
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            💡 <strong>Consejo:</strong> Como administrador, puedes crear, editar y
            eliminar elementos. Los visualizadores solo pueden ver la información.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
