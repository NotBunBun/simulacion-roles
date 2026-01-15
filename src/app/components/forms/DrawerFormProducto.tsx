'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FormField from './FormField';
import { Tipo, Propiedad, Producto } from '@/context/DataContext';

interface DrawerFormProductoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Producto, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Producto;
  tipos: Tipo[];
  propiedades: Propiedad[];
}

export default function DrawerFormProducto({
  open,
  onClose,
  onSubmit,
  initialData,
  tipos,
  propiedades,
}: DrawerFormProductoProps) {
  const [selectedTipoId, setSelectedTipoId] = useState<number | null>(
    initialData?.tipoId || null
  );

  // Get propiedades for selected tipo
  const selectedTipo = useMemo(
    () => tipos.find((t) => t.id === selectedTipoId),
    [selectedTipoId, tipos]
  );

  const tipoPropiedades = useMemo(() => {
    if (!selectedTipo) return [];
    return selectedTipo.propiedades
      .map((propId) => propiedades.find((p) => p.id === propId))
      .filter((p) => p !== undefined) as Propiedad[];
  }, [selectedTipo, propiedades]);

  // Build dynamic schema
  const dynamicSchema = useMemo(() => {
    const propiedadValoresShape: any = {};

    tipoPropiedades.forEach((prop) => {
      switch (prop.tipoPropiedad) {
        case 'texto':
          propiedadValoresShape[prop.id] = yup
            .string()
            .required(`${prop.nombre} es requerido`);
          break;
        case 'numero':
          propiedadValoresShape[prop.id] = yup
            .number()
            .required(`${prop.nombre} es requerido`)
            .typeError(`${prop.nombre} debe ser un número`);
          break;
        case 'fecha':
          propiedadValoresShape[prop.id] = yup
            .string()
            .required(`${prop.nombre} es requerida`)
            .matches(
              /^\d{4}-\d{2}-\d{2}$/,
              `${prop.nombre} debe tener formato YYYY-MM-DD`
            );
          break;
        case 'check':
          propiedadValoresShape[prop.id] = yup
            .boolean()
            .required(`${prop.nombre} es requerido`);
          break;
      }
    });

    return yup.object({
      nombre: yup
        .string()
        .required('El nombre es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
      tipoId: yup
        .number()
        .required('El tipo es requerido')
        .positive('Debe seleccionar un tipo válido'),
      descripcion: yup
        .string()
        .required('La descripción es requerida')
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres'),
      precio: yup
        .number()
        .required('El precio es requerido')
        .positive('El precio debe ser mayor a 0')
        .test(
          'max-decimals',
          'El precio no puede tener más de 2 decimales',
          (value) =>
            value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
        ),
      stock: yup
        .number()
        .required('El stock es requerido')
        .integer('El stock debe ser un número entero')
        .min(0, 'El stock no puede ser negativo'),
      propiedadValores: yup.object(propiedadValoresShape),
    });
  }, [tipoPropiedades]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(dynamicSchema),
    defaultValues: {
      nombre: '',
      tipoId: 0,
      descripcion: '',
      precio: 0,
      stock: 0,
      propiedadValores: {} as { [key: number]: any },
    },
  });

  const watchTipoId = watch('tipoId');

  // Update selected tipo when tipoId changes
  useEffect(() => {
    if (watchTipoId) {
      // If tipo changed and not initial load, clear propiedadValores
      if (selectedTipoId !== null && selectedTipoId !== watchTipoId) {
        setValue('propiedadValores', {});
      }
      setSelectedTipoId(watchTipoId);
    }
  }, [watchTipoId, selectedTipoId, setValue]);

  // Reset form when drawer opens/closes or initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        tipoId: initialData.tipoId,
        descripcion: initialData.descripcion,
        precio: initialData.precio,
        stock: initialData.stock,
        propiedadValores: initialData.propiedadValores || {},
      });
      setSelectedTipoId(initialData.tipoId);
    } else {
      reset({
        nombre: '',
        tipoId: 0,
        descripcion: '',
        precio: 0,
        stock: 0,
        propiedadValores: {},
      });
      setSelectedTipoId(null);
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Render dynamic property field based on type
  const renderPropertyField = (prop: Propiedad) => {
    const fieldName = `propiedadValores.${prop.id}` as any;
    const error = errors.propiedadValores?.[prop.id] as any;

    switch (prop.tipoPropiedad) {
      case 'texto':
        return (
          <FormField
            key={prop.id}
            name={fieldName}
            control={control}
            label={prop.nombre}
            required
          />
        );
      case 'numero':
        return (
          <FormField
            key={prop.id}
            name={fieldName}
            control={control}
            label={prop.nombre}
            type="number"
            required
          />
        );
      case 'fecha':
        return (
          <FormField
            key={prop.id}
            name={fieldName}
            control={control}
            label={prop.nombre}
            type="date"
            required
            textFieldProps={{
              InputLabelProps: { shrink: true },
            }}
          />
        );
      case 'check':
        return (
          <FormControl key={prop.id} fullWidth error={!!error}>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value || false}
                      color="secondary"
                    />
                  }
                  label={prop.nombre}
                />
              )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          width: { xs: '90vw', sm: 500 },
          bgcolor: 'background.paper',
          color: 'text.primary',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5" color="secondary.main">
          {initialData ? 'Editar Producto' : 'Crear Producto'}
        </Typography>

        {/* Basic Fields */}
        <FormField name="nombre" control={control} label="Nombre" required />

        <FormControl fullWidth error={!!errors.tipoId}>
          <InputLabel id="tipo-label">Categoría / Tipo *</InputLabel>
          <Controller
            name="tipoId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="tipo-label"
                label="Categoría / Tipo *"
                color="secondary"
              >
                <MenuItem value={0}>
                  <em>Seleccione un tipo</em>
                </MenuItem>
                {tipos.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.tipoId && (
            <FormHelperText>{errors.tipoId.message}</FormHelperText>
          )}
        </FormControl>

        <FormField
          name="descripcion"
          control={control}
          label="Descripción"
          required
          multiline
          rows={3}
        />

        <FormField
          name="precio"
          control={control}
          label="Precio"
          type="number"
          required
          textFieldProps={{
            InputProps: { startAdornment: '$' },
          }}
        />

        <FormField
          name="stock"
          control={control}
          label="Stock"
          type="number"
          required
        />

        {/* Dynamic Property Fields */}
        {selectedTipoId && selectedTipo && (
          <>
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Propiedades de {selectedTipo.nombre}
              </Typography>
            </Divider>

            {tipoPropiedades.length > 0 ? (
              tipoPropiedades.map((prop) => renderPropertyField(prop))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Este tipo no tiene propiedades configuradas
              </Typography>
            )}
          </>
        )}

        {!selectedTipoId && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'rgba(110, 0, 204, 0.05)',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Seleccione un tipo para ver sus propiedades específicas
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          sx={{ mt: 2 }}
        >
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
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
