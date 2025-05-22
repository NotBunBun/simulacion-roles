'use client';

import NextLink from 'next/link';
import { useContext, useState, useEffect, ChangeEvent } from 'react';
import {
  Container,
  Typography,
  Button,
  Stack,
  TextField,
  Paper,
  Box
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataContext, Propiedad } from '../../src/app/context/DataContext';
import { AuthContext } from '../../src/app/context/AuthContext';
import DrawerFormPropiedad from '../../src/app/components/DrawerFormPropiedad';

export default function GestionPropiedades() {
  const {
    propiedades,
    addPropiedad,
    updatePropiedad,
    deletePropiedad
  } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<Propiedad[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<Propiedad | null>(null);

  useEffect(() => {
    setRows(
      propiedades
        .filter((p) =>
          p.nombre.toLowerCase().includes(search.toLowerCase())
        )
        .map((p) => ({
          ...p,
          fechaCreacion: new Date(p.createdAt).toLocaleDateString()
        }))
    );
  }, [search, propiedades]);

  const handleCreate = () => {
    setEditData(null);
    setDrawerOpen(true);
  };

  const handleEdit = (row: Propiedad) => {
    setEditData(row);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar esta Propiedad?')) {
      deletePropiedad(id);
    }
  };

  const handleSubmit = (data: {
    nombre: string;
    tipoPropiedad: string;
  }) => {
    if (editData) {
      updatePropiedad({ ...editData, ...data });
    } else {
      addPropiedad(data);
    }
    setDrawerOpen(false);
  };

  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'tipoPropiedad', headerName: 'Tipo de Propiedad', flex: 1 },
    { field: 'fechaCreacion', headerName: 'Fecha de Creación', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      sortable: false,
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        if (user?.role !== 'admin') return null;
        const row = params.row as Propiedad;
        return (
          <>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => handleEdit(row)}
              sx={{ mr: 1 }}
            >
              Editar
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleDelete(row.id)}
            >
              Eliminar
            </Button>
          </>
        );
      }
    }
  ];

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
          Gestión de Propiedades
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <TextField
          label="Buscar Propiedades"
          variant="outlined"
          size="small"
          color="secondary"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          sx={{ flex: 1 }}
        />
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Crear Propiedad
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
              '.MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer': {
                borderColor: 'secondary.main'
              },
              '.MuiDataGrid-cell': {
                borderColor: 'secondary.main'
              }
            }}
          />
        </Box>
      </Paper>

      <DrawerFormPropiedad
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
      />
    </Container>
  );
}
