'use client';

import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  required?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  textFieldProps?: Partial<TextFieldProps>;
}

export default function FormField<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  required = false,
  helperText,
  multiline = false,
  rows,
  textFieldProps,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          required={required}
          error={!!error}
          helperText={error ? error.message : helperText}
          fullWidth
          variant="outlined"
          color="secondary"
          multiline={multiline}
          rows={rows}
          {...textFieldProps}
        />
      )}
    />
  );
}
