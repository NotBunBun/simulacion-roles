'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Producto, Tipo, Propiedad } from '@/context/DataContext';

interface ProductoDetalleProps {
  open: boolean;
  onClose: () => void;
  producto: Producto | null;
  tipos: Tipo[];
  propiedades: Propiedad[];
}

export default function ProductoDetalle({
  open,
  onClose,
  producto,
  tipos,
  propiedades,
}: ProductoDetalleProps) {
  if (!producto) return null;

  const tipo = tipos.find((t) => t.id === producto.tipoId);
  const tipoPropiedades = tipo
    ? tipo.propiedades
        .map((propId) => propiedades.find((p) => p.id === propId))
        .filter((p) => p !== undefined) as Propiedad[]
    : [];

  const formatearValor = (propiedad: Propiedad, valor: any) => {
    switch (propiedad.tipoPropiedad) {
      case 'numero':
        return valor.toLocaleString('es-CO');
      case 'fecha':
        return new Date(valor).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'check':
        return valor ? 'Sí' : 'No';
      default:
        return valor;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'secondary.main',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'rgba(110, 0, 204, 0.1)',
          borderBottom: '1px solid',
          borderColor: 'secondary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <InventoryIcon color="secondary" />
        <Typography variant="h5" sx={{ flex: 1 }}>
          Detalle del Producto
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Información Principal */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" color="secondary.main" sx={{ mb: 1 }}>
            {producto.nombre}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              icon={<CategoryIcon />}
              label={tipo?.nombre || 'Sin categoría'}
              color="secondary"
              variant="outlined"
            />
            <Chip
              icon={<CalendarTodayIcon />}
              label={new Date(producto.createdAt).toLocaleDateString('es-CO')}
              variant="outlined"
            />
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {producto.descripcion}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Precio y Stock */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(110, 0, 204, 0.05)',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(110, 0, 204, 0.3)',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalOfferIcon color="secondary" />
                <Typography variant="body2" color="text.secondary">
                  Precio
                </Typography>
              </Stack>
              <Typography variant="h4" color="secondary.main" sx={{ mt: 1 }}>
                ${producto.precio.toLocaleString('es-CO')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(110, 0, 204, 0.05)',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'rgba(110, 0, 204, 0.3)',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <InventoryIcon color="secondary" />
                <Typography variant="body2" color="text.secondary">
                  Stock Disponible
                </Typography>
              </Stack>
              <Typography variant="h4" color="secondary.main" sx={{ mt: 1 }}>
                {producto.stock} unidades
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Propiedades Dinámicas */}
        {tipoPropiedades.length > 0 && (
          <Box>
            <Typography variant="h6" color="secondary.main" sx={{ mb: 2 }}>
              Características de {tipo?.nombre}
            </Typography>
            <Grid container spacing={2}>
              {tipoPropiedades.map((prop) => {
                const valor = producto.propiedadValores[prop.id];
                return (
                  <Grid item xs={12} sm={6} key={prop.id}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                      >
                        {prop.nombre}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {valor !== undefined && valor !== null
                          ? formatearValor(prop, valor)
                          : 'No especificado'}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {tipoPropiedades.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Este producto no tiene características adicionales configuradas
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="secondary"
          startIcon={<CloseIcon />}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
