'use client'

import React, { useContext, useState, ChangeEvent } from 'react';
import NextLink from 'next/link';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DrawerFormTipo from '../../src/app/components/DrawerFormTipo';
import { DataContext, Tipo } from '../../src/app/context/DataContext';
import { AuthContext } from '../../src/app/context/AuthContext';

export default function GestionTipos() {
  const { tipos, propiedades, addTipo, updateTipo, deleteTipo } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<Tipo | null>(null);

  const filtered = tipos.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filtered.map((t) => ({
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion,
    propiedades: t.propiedades.length,
    fechaCreacion: new Date(t.createdAt).toLocaleDateString(),
  }));

  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'descripcion', headerName: 'Descripción', flex: 1 },
    { field: 'propiedades', headerName: 'Propiedades Asignadas', type: 'number', flex: 1 },
    { field: 'fechaCreacion', headerName: 'Fecha de Creación', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        const t = filtered.find((x) => x.id === params.row.id);
        if (!t || user?.role !== 'admin') return null;
        return (
          <>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => { setEditData(t); setDrawerOpen(true); }}
              sx={{ mr: 1 }}
            >
              Editar
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => deleteTipo(t.id)}
            >
              Eliminar
            </Button>
          </>
        );
      },
    },
  ];

  const handleSubmit = (data: { nombre: string; descripcion: string; propiedades: number[] }) => {
    if (editData) updateTipo({ ...editData, ...data });
    else addTipo(data);
    setDrawerOpen(false);
    setEditData(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Button
          component={NextLink}
          href="/"
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBackIcon />}
        >
          Volver
        </Button>
        <Typography variant="h2" color="secondary.main">
          Gestión de Tipos
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <TextField
          label="Buscar Tipos"
          variant="outlined"
          size="small"
          color="secondary"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => { setEditData(null); setDrawerOpen(true); }}
          >
            Crear Tipo
          </Button>
        )}
      </Stack>

      <Paper
        elevation={3}
        sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}
      >
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            sx={{
              '.MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer': { borderColor: 'secondary.main' },
              '.MuiDataGrid-cell': { borderColor: 'secondary.main' },
            }}
          />
        </Box>
      </Paper>

      <DrawerFormTipo
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        propiedadesDisponibles={propiedades.map((p) => ({ id: p.id, nombre: p.nombre }))}
      />
    </Container>
  );
}
