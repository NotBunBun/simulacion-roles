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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataContext, Producto } from '@/context/DataContext';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import DrawerFormProducto from '@/components/forms/DrawerFormProducto';
import EmptyState from '@/components/feedback/EmptyState';
import ProductoDetalle from '@/components/ProductoDetalle';

export default function GestionProductos() {
  const {
    productos,
    tipos,
    propiedades,
    loading,
    addProducto,
    updateProducto,
    deleteProducto,
  } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const { confirm } = useConfirm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<Producto | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleData, setDetalleData] = useState<Producto | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Helper to get tipo name
  const getTipoNombre = (tipoId: number) => {
    const tipo = tipos.find((t) => t.id === tipoId);
    return tipo ? tipo.nombre : 'Sin tipo';
  };

  const filtered = productos.filter((p) =>
    p.nombre.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const rows = filtered.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    tipo: getTipoNombre(p.tipoId),
    tipoId: p.tipoId,
    descripcion: p.descripcion,
    precio: p.precio,
    stock: p.stock,
    propiedadValores: p.propiedadValores,
    fechaCreacion: new Date(p.createdAt).toLocaleDateString(),
  }));

  const handleCreate = () => {
    setEditData(null);
    setDrawerOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditData(producto);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number, nombre: string) => {
    confirm({
      title: '¿Eliminar Producto?',
      message: `¿Estás seguro de que deseas eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteProducto(id);
          toast.success('Producto eliminado exitosamente');
        } catch (error) {
          toast.error('Error al eliminar el producto');
        }
      },
    });
  };

  const handleSubmit = async (data: Omit<Producto, 'id' | 'createdAt'>) => {
    try {
      if (editData) {
        await updateProducto({ ...editData, ...data });
        toast.success('Producto actualizado exitosamente');
      } else {
        await addProducto(data);
        toast.success('Producto creado exitosamente');
      }
      setDrawerOpen(false);
      setEditData(null);
    } catch (error) {
      toast.error(
        editData
          ? 'Error al actualizar el producto'
          : 'Error al crear el producto'
      );
    }
  };

  const handleViewDetalle = (producto: Producto) => {
    setDetalleData(producto);
    setDetalleOpen(true);
  };

  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
    ];

    if (!isMobile) {
      baseColumns.push(
        {
          field: 'tipo',
          headerName: 'Categoría',
          flex: 0.8,
          minWidth: 120,
          renderCell: (params) => (
            <Chip
              label={params.value}
              size="small"
              color="secondary"
              variant="outlined"
            />
          ),
        },
        {
          field: 'precio',
          headerName: 'Precio',
          type: 'number',
          flex: 0.6,
          minWidth: 120,
          valueFormatter: (value: number) =>
            `$${value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        },
        {
          field: 'stock',
          headerName: 'Stock',
          type: 'number',
          flex: 0.5,
          minWidth: 80,
        },
        {
          field: 'fechaCreacion',
          headerName: 'Fecha',
          flex: 0.6,
          minWidth: 100,
        }
      );
    }

    baseColumns.push({
      field: 'acciones',
      headerName: 'Acciones',
      sortable: false,
      flex: 1,
      minWidth: isMobile ? 120 : 240,
      renderCell: (params) => {
        const producto = filtered.find((p) => p.id === params.row.id);
        if (!producto) return null;
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
              onClick={() => handleViewDetalle(producto)}
              fullWidth={isMobile}
            >
              Ver Detalle
            </Button>
            {user?.role === 'admin' && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleEdit(producto)}
                  fullWidth={isMobile}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(producto.id, producto.nombre)}
                  fullWidth={isMobile}
                >
                  Eliminar
                </Button>
              </>
            )}
          </Stack>
        );
      },
    });

    return baseColumns;
  }, [isMobile, user?.role, filtered]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="secondary" size={60} />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Cargando productos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" color="secondary.main" sx={{ mb: 3 }}>
        Gestión de Productos
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <TextField
          label="Buscar Productos"
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
            Crear Producto
          </Button>
        )}
      </Stack>

      {productos.length === 0 ? (
        <EmptyState
          icon={ShoppingCartOutlinedIcon}
          title="No hay productos"
          description="Comienza creando tu primer producto para gestionar tu catálogo."
          actionButton={
            user?.role === 'admin'
              ? {
                  label: 'Crear Primer Producto',
                  onClick: handleCreate,
                }
              : undefined
          }
        />
      ) : rows.length === 0 && debouncedSearch ? (
        <EmptyState
          icon={ShoppingCartOutlinedIcon}
          title="No se encontraron resultados"
          description={`No hay productos que coincidan con "${debouncedSearch}".`}
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

      <DrawerFormProducto
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData || undefined}
        tipos={tipos}
        propiedades={propiedades}
      />

      <ProductoDetalle
        open={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        producto={detalleData}
        tipos={tipos}
        propiedades={propiedades}
      />
    </Container>
  );
}
