'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo, useState } from 'react';
import { ExcelData } from '../types/excel';

interface EChartsViewProps {
  data: ExcelData;
  headers: string[];
}

export default function EChartsView({ data, headers }: EChartsViewProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [maxRows, setMaxRows] = useState(20);
  const [maxSeries, setMaxSeries] = useState(3);
  const chartOptions = useMemo(() => {
    // Find numeric columns for charting
    const numericColumns = headers.filter(header => {
      return data.some(row => typeof row[header] === 'number');
    });

    const categoryColumn = headers.find(header => {
      return data.some(row => typeof row[header] === 'string');
    }) || headers[0];

    const limitedData = data.slice(0, maxRows);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: numericColumns.slice(0, maxSeries)
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
      series: numericColumns.slice(0, maxSeries).map(col => ({
        name: col,
        type: chartType,
        data: limitedData.map(row => Number(row[col]) || 0),
        ...(chartType === 'area' ? { areaStyle: {} } : {})
      }))
    };
  }, [data, headers, chartType, maxRows, maxSeries]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">ECharts (Apache)</h3>
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
      <ReactECharts
        option={chartOptions}
        style={{ height: 400, width: '100%' }}
      />
    </div>
  );
}
