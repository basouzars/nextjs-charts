'use client';

import { DataGridPremium, GridColDef, GridToolbar } from '@mui/x-data-grid-premium';
import { LicenseInfo } from '@mui/x-license';
import { useMemo } from 'react';
import { ExcelData } from '../types/excel';

// Set MUI X license key for Premium features - trial key for evaluation
// Replace with your own license key for production use
LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

interface MUIDataGridViewProps {
  data: ExcelData;
  headers: string[];
}

export default function MUIDataGridView({ data, headers }: MUIDataGridViewProps) {
  const columns: GridColDef[] = useMemo(() => {
    return headers.map((header) => ({
      field: header,
      headerName: header,
      width: 150,
      editable: true,
      filterable: true,
      sortable: true,
      hideable: true,
      groupable: true,
      aggregable: true,
    }));
  }, [headers]);

  const rows = useMemo(() => {
    return data.map((row, index) => ({
      id: index,
      ...row
    }));
  }, [data]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">MUI Data Grid Premium</h2>
      <div style={{ height: 600, width: '100%' }}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          pagination
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          aggregationModel={{}}
          groupingColDef={{
            headerName: 'Group',
            width: 200,
          }}
          columnGroupingModel={[]}
        />
      </div>
    </div>
  );
}
