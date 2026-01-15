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
  Chip,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FormField from './FormField';
import { tipoSchema } from '@/validation/schemas';

interface DrawerFormTipoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nombre: string;
    descripcion: string;
    propiedades: number[];
  }) => Promise<void>;
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
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(tipoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      propiedades: [] as number[],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        descripcion: initialData.descripcion,
        propiedades: initialData.propiedades,
      });
    } else {
      reset({
        nombre: '',
        descripcion: '',
        propiedades: [],
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = async (data: {
    nombre: string;
    descripcion: string;
    propiedades: number[];
  }) => {
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
          {initialData ? 'Editar Tipo' : 'Crear Tipo'}
        </Typography>

        <FormField name="nombre" control={control} label="Nombre" required />

        <FormField
          name="descripcion"
          control={control}
          label="Descripción"
          required
          multiline
          rows={3}
        />

        <FormControl fullWidth error={!!errors.propiedades}>
          <InputLabel id="propiedades-label">Propiedades *</InputLabel>
          <Controller
            name="propiedades"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="propiedades-label"
                multiple
                label="Propiedades *"
                color="secondary"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {propiedadesDisponibles
                      .filter((p) => (selected as number[]).includes(p.id))
                      .map((p) => (
                        <Chip
                          key={p.id}
                          label={p.nombre}
                          size="small"
                          sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                          }}
                        />
                      ))}
                  </Box>
                )}
              >
                {propiedadesDisponibles.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.propiedades && (
            <FormHelperText>{errors.propiedades.message}</FormHelperText>
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
