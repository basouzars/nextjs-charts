'use client';

import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo, useState } from 'react';
import { ExcelData } from '../types/excel';

interface MUIChartsViewProps {
  data: ExcelData;
  headers: string[];
}

export default function MUIChartsView({ data, headers }: MUIChartsViewProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [maxRows, setMaxRows] = useState(20);
  const [maxSeries, setMaxSeries] = useState(3);
  const chartData = useMemo(() => {
    // Find numeric columns for charting
    const numericColumns = headers.filter(header => {
      return data.some(row => typeof row[header] === 'number');
    });

    const categoryColumn = headers.find(header => {
      return data.some(row => typeof row[header] === 'string');
    }) || headers[0];

    const limitedData = data.slice(0, maxRows);

    return {
      categories: limitedData.map(row => String(row[categoryColumn] || '')),
      series: numericColumns.slice(0, maxSeries).map(col => ({
        data: limitedData.map(row => Number(row[col]) || 0),
        label: col,
      })),
    };
  }, [data, headers, maxRows, maxSeries]);

  if (data.length === 0) {
    return null;
  }

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">MUI Charts</h3>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="font-medium">Chart Type:</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value as 'bar' | 'line')}
            className="px-3 py-1 border rounded"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">Max Rows:</label>
          <input 
            type="number" 
            value={maxRows} 
            onChange={(e) => setMaxRows(parseInt(e.target.value) || 20)}
            min="5"
            max="100"
            className="px-3 py-1 border rounded w-20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">Max Series:</label>
          <input 
            type="number" 
            value={maxSeries} 
            onChange={(e) => setMaxSeries(parseInt(e.target.value) || 3)}
            min="1"
            max="10"
            className="px-3 py-1 border rounded w-20"
          />
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <ChartComponent
          xAxis={[{ scaleType: 'band', data: chartData.categories }]}
          series={chartData.series}
          height={400}
        />
      </div>
    </div>
  );
}
