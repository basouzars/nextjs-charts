'use client';

import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';
import { ExcelData } from '../types/excel';

interface MUIChartsViewProps {
  data: ExcelData;
  headers: string[];
}

export default function MUIChartsView({ data, headers }: MUIChartsViewProps) {
  const chartData = useMemo(() => {
    // Find numeric columns for charting
    const numericColumns = headers.filter(header => {
      return data.some(row => typeof row[header] === 'number');
    });

    const categoryColumn = headers.find(header => {
      return data.some(row => typeof row[header] === 'string');
    }) || headers[0];

    const limitedData = data.slice(0, 20); // Limit to first 20 rows

    return {
      categories: limitedData.map(row => String(row[categoryColumn] || '')),
      series: numericColumns.slice(0, 3).map(col => ({
        data: limitedData.map(row => Number(row[col]) || 0),
        label: col,
      })),
    };
  }, [data, headers]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">MUI Charts</h3>
      <div style={{ width: '100%' }}>
        <BarChart
          xAxis={[{ scaleType: 'band', data: chartData.categories }]}
          series={chartData.series}
          height={400}
        />
      </div>
    </div>
  );
}
