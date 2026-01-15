'use client';

import { useContext, useState, useEffect, ChangeEvent, useMemo } from 'react';
import {
  Container,
  Typography,
  Button,
  Stack,
  TextField,
  Paper,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataContext, Propiedad } from '@/context/DataContext';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import DrawerFormPropiedad from '@/components/forms/DrawerFormPropiedad';
import EmptyState from '@/components/feedback/EmptyState';

export default function GestionPropiedades() {
  const {
    propiedades,
    loading,
    addPropiedad,
    updatePropiedad,
    deletePropiedad,
  } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const { confirm } = useConfirm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [rows, setRows] = useState<Propiedad[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<Propiedad | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setRows(
      propiedades
        .filter((p) =>
          p.nombre.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .map((p) => ({
          ...p,
          fechaCreacion: new Date(p.createdAt).toLocaleDateString(),
        }))
    );
  }, [debouncedSearch, propiedades]);

  const handleCreate = () => {
    setEditData(null);
    setDrawerOpen(true);
  };

  const handleEdit = (row: Propiedad) => {
    setEditData(row);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number, nombre: string) => {
    confirm({
      title: '¿Eliminar Propiedad?',
      message: `¿Estás seguro de que deseas eliminar la propiedad "${nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deletePropiedad(id);
          toast.success('Propiedad eliminada exitosamente');
        } catch (error) {
          toast.error('Error al eliminar la propiedad');
        }
      },
    });
  };

  const handleSubmit = async (data: {
    nombre: string;
    tipoPropiedad: string;
  }) => {
    try {
      if (editData) {
        await updatePropiedad({ ...editData, ...data });
        toast.success('Propiedad actualizada exitosamente');
      } else {
        await addPropiedad(data);
        toast.success('Propiedad creada exitosamente');
      }
      setDrawerOpen(false);
    } catch (error) {
      toast.error(
        editData
          ? 'Error al actualizar la propiedad'
          : 'Error al crear la propiedad'
      );
    }
  };

  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
    ];

    if (!isMobile) {
      baseColumns.push(
        { field: 'tipoPropiedad', headerName: 'Tipo', flex: 1, minWidth: 120 },
        { field: 'fechaCreacion', headerName: 'Fecha', flex: 1, minWidth: 120 }
      );
    }

    if (user?.role === 'admin') {
      baseColumns.push({
        field: 'acciones',
        headerName: 'Acciones',
        sortable: false,
        flex: 1,
        minWidth: isMobile ? 100 : 180,
        renderCell: (params) => {
          const row = params.row as Propiedad;
          return (
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={1}
              sx={{ width: '100%' }}
            >
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => handleEdit(row)}
                fullWidth={isMobile}
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDelete(row.id, row.nombre)}
                fullWidth={isMobile}
              >
                Eliminar
              </Button>
            </Stack>
          );
        },
      });
    }

    return baseColumns;
  }, [isMobile, user?.role]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="secondary" size={60} />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Cargando propiedades...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" color="secondary.main" sx={{ mb: 3 }}>
        Gestión de Propiedades
      </Typography>

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
            fullWidth={isMobile}
          >
            Crear Propiedad
          </Button>
        )}
      </Stack>

      {propiedades.length === 0 ? (
        <EmptyState
          icon={InboxOutlinedIcon}
          title="No hay propiedades"
          description="Comienza creando tu primera propiedad para gestionar tu catálogo."
          actionButton={
            user?.role === 'admin'
              ? {
                  label: 'Crear Primera Propiedad',
                  onClick: handleCreate,
                }
              : undefined
          }
        />
      ) : rows.length === 0 && debouncedSearch ? (
        <EmptyState
          icon={InboxOutlinedIcon}
          title="No se encontraron resultados"
          description={`No hay propiedades que coincidan con "${debouncedSearch}".`}
        />
      ) : (
        <Paper
          elevation={3}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              density={isMobile ? 'compact' : 'standard'}
              sx={{
                '.MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer': {
                  borderColor: 'secondary.main',
                },
                '.MuiDataGrid-cell': {
                  borderColor: 'secondary.main',
                },
              }}
            />
          </Box>
        </Paper>
      )}

      <DrawerFormPropiedad
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData || undefined}
      />
    </Container>
  );
}
