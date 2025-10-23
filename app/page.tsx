'use client';

import { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import FileUpload from '@/components/FileUpload';
import DataGridViewer from '@/components/DataGridViewer';
import ChartCreator from '@/components/ChartCreator';
import ChartCard from '@/components/ChartCard';

interface UploadedData {
  tableName: string;
  rowCount: number;
  columns: string[];
}

interface ChartConfig {
  id: string;
  xColumn: string;
  yColumn: string;
  chartType: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export default function Home() {
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [charts, setCharts] = useState<ChartConfig[]>([]);

  const handleUploadSuccess = (data: UploadedData) => {
    setUploadedData(data);
    setCharts([]);
  };

  const handleCreateChart = (config: {
    xColumn: string;
    yColumn: string;
    chartType: string;
  }) => {
    const newChart: ChartConfig = {
      id: `chart-${Date.now()}`,
      ...config,
      position: { x: 20 + charts.length * 30, y: 20 + charts.length * 30 },
      size: { width: 500, height: 400 },
    };
    setCharts([...charts, newChart]);
  };

  const handleRemoveChart = (id: string) => {
    setCharts(charts.filter((chart) => chart.id !== id));
  };

  const handlePositionChange = (id: string, position: { x: number; y: number }) => {
    setCharts(
      charts.map((chart) => (chart.id === id ? { ...chart, position } : chart))
    );
  };

  const handleSizeChange = (id: string, size: { width: number; height: number }) => {
    setCharts(charts.map((chart) => (chart.id === id ? { ...chart, size } : chart)));
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Data Analysis Dashboard
      </Typography>

      {!uploadedData ? (
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Data Preview ({uploadedData.rowCount} rows)
            </Typography>
            <DataGridViewer
              tableName={uploadedData.tableName}
              columns={uploadedData.columns}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <ChartCreator
              columns={uploadedData.columns}
              onCreateChart={handleCreateChart}
            />
          </Box>

          <Box sx={{ position: 'relative', minHeight: '600px', border: '1px dashed #ccc', borderRadius: 1 }}>
            {charts.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                }}
              >
                <Typography color="text.secondary">
                  No charts created yet. Click &quot;Create Chart&quot; to get started.
                </Typography>
              </Box>
            ) : (
              charts.map((chart) => (
                <ChartCard
                  key={chart.id}
                  id={chart.id}
                  tableName={uploadedData.tableName}
                  xColumn={chart.xColumn}
                  yColumn={chart.yColumn}
                  chartType={chart.chartType}
                  onRemove={handleRemoveChart}
                  position={chart.position}
                  size={chart.size}
                  onPositionChange={handlePositionChange}
                  onSizeChange={handleSizeChange}
                />
              ))
            )}
          </Box>
        </>
      )}
    </Container>
  );
}
