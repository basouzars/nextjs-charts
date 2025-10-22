'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { ExcelData } from '../types/excel';

interface EChartsViewProps {
  data: ExcelData;
  headers: string[];
}

export default function EChartsView({ data, headers }: EChartsViewProps) {
  const chartOptions = useMemo(() => {
    // Find numeric columns for charting
    const numericColumns = headers.filter(header => {
      return data.some(row => typeof row[header] === 'number');
    });

    const categoryColumn = headers.find(header => {
      return data.some(row => typeof row[header] === 'string');
    }) || headers[0];

    const limitedData = data.slice(0, 20); // Limit to first 20 rows

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: numericColumns.slice(0, 3)
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: limitedData.map(row => String(row[categoryColumn] || ''))
      },
      yAxis: {
        type: 'value'
      },
      series: numericColumns.slice(0, 3).map(col => ({
        name: col,
        type: 'bar',
        data: limitedData.map(row => Number(row[col]) || 0)
      }))
    };
  }, [data, headers]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">ECharts (Apache)</h3>
      <ReactECharts
        option={chartOptions}
        style={{ height: 400, width: '100%' }}
      />
    </div>
  );
}
