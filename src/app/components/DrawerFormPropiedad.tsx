'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
} from '@mui/material';

interface DrawerFormPropiedadProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; tipoPropiedad: string }) => void;
  initialData?: { nombre: string; tipoPropiedad: string };
}

export default function DrawerFormPropiedad({
  open,
  onClose,
  onSubmit,
  initialData,
}: DrawerFormPropiedadProps) {
  const [nombre, setNombre] = useState('');
  const [tipoProp, setTipoProp] = useState<'texto' | 'numero' | 'fecha' | 'check'>('texto');

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setTipoProp(initialData.tipoPropiedad as any);
    } else {
      setNombre('');
      setTipoProp('texto');
    }
  }, [initialData]);

  const handleSave = () => {
    onSubmit({ nombre, tipoPropiedad: tipoProp });
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: '80vw', sm: 400 },
          bgcolor: 'background.paper',
          color: 'text.primary',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" color="secondary.main">
          {initialData ? 'Editar Propiedad' : 'Crear Propiedad'}
        </Typography>

        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          variant="outlined"
          color="secondary"
        />

        <FormControl fullWidth>
          <InputLabel>Tipo de Propiedad</InputLabel>
          <Select
            value={tipoProp}
            label="Tipo de Propiedad"
            onChange={(e) => setTipoProp(e.target.value as any)}
            color="secondary"
          >
            <MenuItem value="texto">Texto</MenuItem>
            <MenuItem value="numero">Número</MenuItem>
            <MenuItem value="fecha">Fecha</MenuItem>
            <MenuItem value="check">Check</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSave}
            sx={{
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 0 12px rgba(142,0,204,0.6)',
              },
            }}
          >
            Guardar
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
