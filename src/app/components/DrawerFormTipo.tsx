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

interface DrawerFormTipoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; descripcion: string; propiedades: number[] }) => void;
  initialData?: { nombre: string; descripcion: string; propiedades: number[] };
  propiedadesDisponibles: { id: number; nombre: string }[];
}

export default function DrawerFormTipo({
  open,
  onClose,
  onSubmit,
  initialData,
  propiedadesDisponibles,
}: DrawerFormTipoProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedProps, setSelectedProps] = useState<number[]>([]);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setDescripcion(initialData.descripcion);
      setSelectedProps(initialData.propiedades);
    } else {
      setNombre('');
      setDescripcion('');
      setSelectedProps([]);
    }
  }, [initialData]);

  const handleSave = () => {
    onSubmit({ nombre, descripcion, propiedades: selectedProps });
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
          {initialData ? 'Editar Tipo' : 'Crear Tipo'}
        </Typography>

        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          color="secondary"
        />

        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          color="secondary"
          multiline
          rows={3}
        />

        <FormControl fullWidth>
          <InputLabel>Propiedades</InputLabel>
          <Select
            multiple
            value={selectedProps}
            onChange={(e) => setSelectedProps(e.target.value as number[])}
            label="Propiedades"
            color="secondary"
            renderValue={(selected) =>
              propiedadesDisponibles
                .filter((p) => selected.includes(p.id))
                .map((p) => p.nombre)
                .join(', ')
            }
          >
            {propiedadesDisponibles.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nombre}
              </MenuItem>
            ))}
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
