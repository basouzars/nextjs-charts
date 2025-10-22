'use client';

import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import 'ag-charts-enterprise';
import { useMemo } from 'react';
import { ExcelData } from '../types/excel';

interface AGChartsViewProps {
  data: ExcelData;
  headers: string[];
}

export default function AGChartsView({ data, headers }: AGChartsViewProps) {
  const chartOptions: AgChartOptions = useMemo(() => {
    // Find numeric columns for charting
    const numericColumns = headers.filter(header => {
      return data.some(row => typeof row[header] === 'number');
    });

    const categoryColumn = headers.find(header => {
      return data.some(row => typeof row[header] === 'string');
    }) || headers[0];

    return {
      data: data.slice(0, 20), // Limit to first 20 rows for better visualization
      series: numericColumns.slice(0, 3).map(col => ({
        type: 'bar',
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
  }, [data, headers]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">AG Charts</h3>
      <div style={{ height: 400, width: '100%' }}>
        <AgCharts options={chartOptions} />
      </div>
    </div>
  );
}
