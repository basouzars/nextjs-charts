'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
} from '@mui/x-charts-premium';
import { Rnd } from 'react-rnd';

interface ChartCardProps {
  id: string;
  tableName: string;
  xColumn: string;
  yColumn: string;
  chartType: string;
  onRemove: (id: string) => void;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
}

export default function ChartCard({
  id,
  tableName,
  xColumn,
  yColumn,
  chartType,
  onRemove,
  position,
  size,
  onPositionChange,
  onSizeChange,
}: ChartCardProps) {
  const [data, setData] = useState<{ [key: string]: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/chart-data?table=${tableName}&xColumn=${xColumn}&yColumn=${yColumn}`
        );
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, xColumn, yColumn]);

  const renderChart = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (data.length === 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      );
    }

    const chartData = data.map((item) => ({
      x: item[xColumn],
      y: parseFloat(item[yColumn]) || 0,
    }));

    const commonProps = {
      xAxis: [{ scaleType: 'band' as const, data: chartData.map((d) => d.x) }],
      series: [
        {
          data: chartData.map((d) => d.y),
          label: yColumn,
        },
      ],
      height: size.height - 80,
    };

    switch (chartType) {
      case 'line':
        return <LineChart {...commonProps} />;
      case 'scatter':
        return (
          <ScatterChart
            series={[
              {
                data: chartData.map((d, idx) => ({ x: idx, y: d.y, id: idx })),
                label: yColumn,
              },
            ]}
            height={size.height - 80}
          />
        );
      case 'pie':
        return (
          <PieChart
            series={[
              {
                data: chartData.map((d, idx) => ({
                  id: idx,
                  value: d.y,
                  label: String(d.x),
                })),
              },
            ]}
            height={size.height - 80}
          />
        );
      case 'bar':
      default:
        return <BarChart {...commonProps} />;
    }
  };

  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => {
        onPositionChange(id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onSizeChange(id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        onPositionChange(id, position);
      }}
      minWidth={300}
      minHeight={250}
      bounds="parent"
    >
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
            borderBottom: 1,
            borderColor: 'divider',
            cursor: 'move',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicatorIcon fontSize="small" />
            <Typography variant="subtitle2">
              {xColumn} vs {yColumn}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => onRemove(id)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>{renderChart()}</Box>
      </Paper>
    </Rnd>
  );
}
