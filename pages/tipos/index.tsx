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
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataContext, Tipo } from '@/context/DataContext';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import DrawerFormTipo from '@/components/forms/DrawerFormTipo';
import EmptyState from '@/components/feedback/EmptyState';

export default function GestionTipos() {
  const {
    tipos,
    propiedades,
    loading,
    addTipo,
    updateTipo,
    deleteTipo,
  } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const { confirm } = useConfirm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<Tipo | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = tipos.filter((t) =>
    t.nombre.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const rows = filtered.map((t) => ({
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion,
    propiedades: t.propiedades.length,
    fechaCreacion: new Date(t.createdAt).toLocaleDateString(),
  }));

  const handleCreate = () => {
    setEditData(null);
    setDrawerOpen(true);
  };

  const handleEdit = (tipo: Tipo) => {
    setEditData(tipo);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number, nombre: string) => {
    confirm({
      title: '¿Eliminar Tipo?',
      message: `¿Estás seguro de que deseas eliminar el tipo "${nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteTipo(id);
          toast.success('Tipo eliminado exitosamente');
        } catch (error) {
          toast.error('Error al eliminar el tipo');
        }
      },
    });
  };

  const handleSubmit = async (data: {
    nombre: string;
    descripcion: string;
    propiedades: number[];
  }) => {
    try {
      if (editData) {
        await updateTipo({ ...editData, ...data });
        toast.success('Tipo actualizado exitosamente');
      } else {
        await addTipo(data);
        toast.success('Tipo creado exitosamente');
      }
      setDrawerOpen(false);
      setEditData(null);
    } catch (error) {
      toast.error(
        editData ? 'Error al actualizar el tipo' : 'Error al crear el tipo'
      );
    }
  };

  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
    ];

    if (!isMobile) {
      baseColumns.push(
        {
          field: 'descripcion',
          headerName: 'Descripción',
          flex: 1,
          minWidth: 200,
        },
        {
          field: 'propiedades',
          headerName: 'Propiedades',
          type: 'number',
          flex: 0.5,
          minWidth: 100,
        },
        {
          field: 'fechaCreacion',
          headerName: 'Fecha',
          flex: 0.5,
          minWidth: 120,
        }
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
          const tipo = filtered.find((t) => t.id === params.row.id);
          if (!tipo) return null;
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
                onClick={() => handleEdit(tipo)}
                fullWidth={isMobile}
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDelete(tipo.id, tipo.nombre)}
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
  }, [isMobile, user?.role, filtered]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="secondary" size={60} />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Cargando tipos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" color="secondary.main" sx={{ mb: 3 }}>
        Gestión de Tipos
      </Typography>

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
            Crear Tipo
          </Button>
        )}
      </Stack>

      {tipos.length === 0 ? (
        <EmptyState
          icon={FolderOpenOutlinedIcon}
          title="No hay tipos"
          description="Comienza creando tu primer tipo para organizar tu catálogo."
          actionButton={
            user?.role === 'admin'
              ? {
                  label: 'Crear Primer Tipo',
                  onClick: handleCreate,
                }
              : undefined
          }
        />
      ) : rows.length === 0 && debouncedSearch ? (
        <EmptyState
          icon={FolderOpenOutlinedIcon}
          title="No se encontraron resultados"
          description={`No hay tipos que coincidan con "${debouncedSearch}".`}
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

      <DrawerFormTipo
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData || undefined}
        propiedadesDisponibles={propiedades.map((p) => ({
          id: p.id,
          nombre: p.nombre,
        }))}
      />
    </Container>
  );
}
