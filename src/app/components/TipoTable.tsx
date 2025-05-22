'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import NextLink from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TipoTableProps {
  data: any[];
}

export default class TipoTable extends React.Component<TipoTableProps> {
  columns: GridColDef[];

  constructor(props: TipoTableProps) {
    super(props);
    this.columns = [
      { field: 'nombre', headerName: 'Nombre', flex: 1 },
      { field: 'descripcion', headerName: 'Descripción', flex: 1 },
      {
        field: 'propiedades', headerName: 'Propiedades', flex: 1,
        valueGetter: (params: any) => params.row.propiedades?.length ?? 0,
      },
      {
        field: 'fechaCreacion', headerName: 'Fecha de Creación', flex: 1,
        valueGetter: (params: any) => new Date(params.row.fechaCreacion).toLocaleDateString(),
      },
    ];
  }

  render() {
    return (
      <Box sx={{ width: '100%' }}>
        {/* Botón Volver */}
        <Button
          component={NextLink}
          href="/"
          startIcon={<ArrowBackIcon />}
          color="secondary"
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Volver
        </Button>

        {/* Título de la sección */}
        <Typography variant="h2" color="secondary.main" gutterBottom>
          Gestión de Tipos
        </Typography>

        {/* Contenedor de la tabla */}
        <Box sx={{ height: 500, bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
          <DataGrid
            rows={this.props.data}
            columns={this.columns}
            getRowId={(row: any) => row.id}
            paginationModel={{ pageSize: 5, page: 0 }}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              '.MuiDataGrid-columnHeaders': {
                backgroundColor: 'background.default',
                borderBottom: 1,
                borderColor: 'secondary.main',
                color: 'text.primary'
              },
              '.MuiDataGrid-cell': {
                borderBottom: 1,
                borderColor: 'secondary.main',
                color: 'text.primary'
              },
              '.MuiDataGrid-footerContainer': {
                borderTop: 1,
                borderColor: 'secondary.main'
              }
            }}
          />
        </Box>
      </Box>
    );
  }
}