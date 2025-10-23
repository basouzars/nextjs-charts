'use client';

import { useState, useMemo, useCallback } from 'react';
import { DataGridPremium, GridColDef, GridToolbar, GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { LicenseInfo } from '@mui/x-license';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ExcelData } from '../types/excel';

// Set MUI X license key for Premium features - trial key for evaluation
// Replace with your own license key for production use
LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

interface IntegratedDataViewProps {
  data: ExcelData;
  headers: string[];
}

export default function IntegratedDataView({ data, headers }: IntegratedDataViewProps) {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [chartsEnabled, setChartsEnabled] = useState(false);

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

  // Get numeric columns for charting
  const numericColumns = useMemo(() => {
    return headers.filter(header => {
      return data.some(row => typeof row[header] === 'number');
    });
  }, [headers, data]);

  // Get category column (first non-numeric or first column)
  const categoryColumn = useMemo(() => {
    return headers.find(header => {
      return data.some(row => typeof row[header] === 'string');
    }) || headers[0];
  }, [headers, data]);

  // Filter data based on selected rows - only compute when charts are enabled
  const chartData = useMemo(() => {
    if (!chartsEnabled) return null;
    
    const selectedData = rowSelectionModel.length > 0
      ? data.filter((_, index) => rowSelectionModel.includes(index))
      : data;

    const columnsToChart = selectedColumns.length > 0 
      ? selectedColumns 
      : numericColumns.slice(0, 5);

    return {
      categories: selectedData.map(row => String(row[categoryColumn] || '')),
      series: columnsToChart.map(col => ({
        data: selectedData.map(row => Number(row[col]) || 0),
        label: col,
      })),
    };
  }, [chartsEnabled, data, rowSelectionModel, selectedColumns, numericColumns, categoryColumn]);

  // Pie chart data (for first selected column or first numeric column) - only compute when charts are enabled
  const pieData = useMemo(() => {
    if (!chartsEnabled) return [];
    
    const selectedData = rowSelectionModel.length > 0
      ? data.filter((_, index) => rowSelectionModel.includes(index))
      : data.slice(0, 10);

    const columnToChart = selectedColumns[0] || numericColumns[0];
    if (!columnToChart) return [];

    return selectedData.map((row, index) => ({
      id: index,
      value: Number(row[columnToChart]) || 0,
      label: String(row[categoryColumn] || `Item ${index + 1}`),
    }));
  }, [chartsEnabled, data, rowSelectionModel, selectedColumns, numericColumns, categoryColumn]);

  const handleColumnSelectionChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.selectedOptions;
    const selected = Array.from(options).map(option => option.value);
    setSelectedColumns(selected);
  }, []);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">MUI Data Grid Premium</h2>
        <div className="mb-4 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-2">
            Select rows in the grid to filter the chart data. {rowSelectionModel.length > 0 && `(${rowSelectionModel.length} rows selected)`}
          </p>
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGridPremium
            rows={rows}
            columns={columns}
            pagination
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 20, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newSelection) => setRowSelectionModel(newSelection)}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            density="compact"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">MUI X Charts - Integrated View</h2>
        <div className="mb-4 p-4 bg-white rounded-lg shadow flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <label className="font-medium">Chart Type:</label>
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
              className="px-3 py-2 border rounded"
              disabled={!chartsEnabled}
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-medium">Columns to Chart:</label>
            <select 
              multiple
              value={selectedColumns}
              onChange={handleColumnSelectionChange}
              className="px-3 py-2 border rounded h-24"
              size={5}
              disabled={!chartsEnabled}
            >
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setChartsEnabled(!chartsEnabled)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                chartsEnabled 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {chartsEnabled ? '❌ Hide Charts' : '📊 Generate Charts'}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4" style={{ width: '100%', height: 500 }}>
          {!chartsEnabled ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl font-semibold mb-2">Charts Not Generated</p>
                <p className="text-base">Click &quot;Generate Charts&quot; above to visualize your data</p>
                <p className="text-sm mt-2 text-gray-400">
                  This prevents automatic chart generation for large datasets
                </p>
              </div>
            </div>
          ) : chartData && chartType === 'pie' ? (
            <PieChart
              series={[
                {
                  data: pieData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              height={450}
            />
          ) : chartData && chartType === 'bar' ? (
            <BarChart
              xAxis={[{ scaleType: 'band', data: chartData.categories }]}
              series={chartData.series}
              height={450}
            />
          ) : chartData && chartType === 'line' ? (
            <LineChart
              xAxis={[{ scaleType: 'band', data: chartData.categories }]}
              series={chartData.series}
              height={450}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
