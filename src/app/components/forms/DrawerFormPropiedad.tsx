'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Drawer,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FormField from './FormField';
import { propiedadSchema } from '@/validation/schemas';

interface DrawerFormPropiedadProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; tipoPropiedad: string }) => Promise<void>;
  initialData?: { nombre: string; tipoPropiedad: string };
}

export default function DrawerFormPropiedad({
  open,
  onClose,
  onSubmit,
  initialData,
}: DrawerFormPropiedadProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(propiedadSchema),
    defaultValues: {
      nombre: '',
      tipoPropiedad: 'texto',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        tipoPropiedad: initialData.tipoPropiedad,
      });
    } else {
      reset({
        nombre: '',
        tipoPropiedad: 'texto',
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = async (data: { nombre: string; tipoPropiedad: string }) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
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

        <FormField
          name="nombre"
          control={control}
          label="Nombre"
          required
        />

        <FormControl fullWidth error={!!errors.tipoPropiedad}>
          <InputLabel id="tipo-propiedad-label">Tipo de Propiedad *</InputLabel>
          <Controller
            name="tipoPropiedad"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="tipo-propiedad-label"
                label="Tipo de Propiedad *"
                color="secondary"
              >
                <MenuItem value="texto">Texto</MenuItem>
                <MenuItem value="numero">Número</MenuItem>
                <MenuItem value="fecha">Fecha</MenuItem>
                <MenuItem value="check">Check</MenuItem>
              </Select>
            )}
          />
          {errors.tipoPropiedad && (
            <FormHelperText>{errors.tipoPropiedad.message}</FormHelperText>
          )}
        </FormControl>

        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={{
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 0 12px rgba(110,0,204,0.6)',
              },
            }}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
