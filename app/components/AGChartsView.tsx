'use client';

import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import 'ag-charts-enterprise';
import { useMemo, useState } from 'react';
import { ExcelData } from '../types/excel';

interface AGChartsViewProps {
  data: ExcelData;
  headers: string[];
}

export default function AGChartsView({ data, headers }: AGChartsViewProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [maxRows, setMaxRows] = useState(20);
  const [maxSeries, setMaxSeries] = useState(3);
  const chartOptions: AgChartOptions = useMemo(() => {
    // Find numeric columns for charting
    const numericColumns = headers.filter(header => {
      return data.some(row => typeof row[header] === 'number');
    });

    const categoryColumn = headers.find(header => {
      return data.some(row => typeof row[header] === 'string');
    }) || headers[0];

    return {
      data: data.slice(0, maxRows),
      series: numericColumns.slice(0, maxSeries).map(col => ({
        type: chartType,
        xKey: categoryColumn,
        yKey: col,
        yName: col,
      })),
      axes: [
        {
          type: 'category',
          position: 'bottom',
        },
        {
          type: 'number',
          position: 'left',
        },
      ],
      legend: {
        position: 'bottom',
      },
    };
  }, [data, headers, chartType, maxRows, maxSeries]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">AG Charts</h3>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="font-medium">Chart Type:</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'area')}
            className="px-3 py-1 border rounded"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="area">Area</option>
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
      <div style={{ height: 400, width: '100%' }}>
        <AgCharts options={chartOptions} />
      </div>
    </div>
  );
}
