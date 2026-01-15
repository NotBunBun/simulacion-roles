import * as yup from 'yup';

export const propiedadSchema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Solo letras, números y espacios permitidos'),
  tipoPropiedad: yup
    .string()
    .required('El tipo de propiedad es requerido')
    .oneOf(['texto', 'numero', 'fecha', 'check'], 'Tipo inválido'),
});

export const tipoSchema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  descripcion: yup
    .string()
    .required('La descripción es requerida')
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  propiedades: yup
    .array()
    .of(yup.number().required())
    .min(1, 'Debe seleccionar al menos una propiedad')
    .required('Las propiedades son requeridas'),
});

export const productoSchema = yup.object({
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
    .integer('El precio debe ser un número entero'),
  stock: yup
    .number()
    .required('El stock es requerido')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  propiedadValores: yup
    .object()
    .required('Debe completar todas las propiedades del tipo seleccionado'),
});
