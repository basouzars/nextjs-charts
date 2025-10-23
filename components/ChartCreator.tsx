'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
} from '@mui/material';
import AddChartIcon from '@mui/icons-material/Addchart';

interface ChartCreatorProps {
  columns: string[];
  onCreateChart: (config: {
    xColumn: string;
    yColumn: string;
    chartType: string;
  }) => void;
}

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
  { value: 'pie', label: 'Pie Chart' },
];

export default function ChartCreator({ columns, onCreateChart }: ChartCreatorProps) {
  const [open, setOpen] = useState(false);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [chartType, setChartType] = useState('bar');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setXColumn('');
    setYColumn('');
    setChartType('bar');
  };

  const handleCreate = () => {
    if (xColumn && yColumn) {
      onCreateChart({ xColumn, yColumn, chartType });
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddChartIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Create Chart
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Chart</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>X Axis Column</InputLabel>
              <Select
                value={xColumn}
                label="X Axis Column"
                onChange={(e: SelectChangeEvent) => setXColumn(e.target.value)}
              >
                {columns.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Y Axis Column</InputLabel>
              <Select
                value={yColumn}
                label="Y Axis Column"
                onChange={(e: SelectChangeEvent) => setYColumn(e.target.value)}
              >
                {columns.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                label="Chart Type"
                onChange={(e: SelectChangeEvent) => setChartType(e.target.value)}
              >
                {CHART_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!xColumn || !yColumn}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
