'use client';

import { useState, useEffect } from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
} from '@mui/x-data-grid-premium';
import { Box, Paper } from '@mui/material';

interface DataGridViewerProps {
  tableName: string;
  columns: string[];
}

export default function DataGridViewer({ tableName, columns }: DataGridViewerProps) {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 100,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/data?table=${tableName}&page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`
        );
        const data = await response.json();
        setRows(data.rows);
        setRowCount(data.total);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, paginationModel]);

  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col,
    headerName: col,
    width: 150,
    editable: false,
  }));

  return (
    <Paper sx={{ height: 600, width: '100%', mb: 4 }}>
      <DataGridPremium
        rows={rows}
        columns={gridColumns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
        rowCount={rowCount}
        paginationMode="server"
        loading={loading}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
