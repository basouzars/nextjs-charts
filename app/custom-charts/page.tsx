'use client';

import { useState, useEffect, useMemo } from 'react';
import AppHeader from '../components/AppHeader';
import { LicenseInfo } from '@mui/x-license';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ExcelData } from '../types/excel';

LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

type ChartType = 'bar' | 'line' | 'pie' | 'scatter';

export default function CustomChartsPage() {
  const [data, setData] = useState<ExcelData>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [chartType, setChartType] = useState<ChartType>('bar');
  
  // Chart configuration
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string[]>([]);
  const [chartHeight, setChartHeight] = useState(400);
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition, setLegendPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  const [showGrid, setShowGrid] = useState(true);
  const [stackedBars, setStackedBars] = useState(false);
  const [curveType, setCurveType] = useState<'linear' | 'natural' | 'monotoneX' | 'monotoneY' | 'step'>('linear');
  const [showMarkers, setShowMarkers] = useState(true);
  const [fillArea, setFillArea] = useState(false);
  
  // Pie chart specific
  const [pieValueColumn, setPieValueColumn] = useState<string>('');
  const [pieLabelColumn, setPieLabelColumn] = useState<string>('');
  const [innerRadius, setInnerRadius] = useState(0);
  const [outerRadius, setOuterRadius] = useState(100);

  const handleDataLoaded = (loadedData: ExcelData, loadedHeaders: string[]) => {
    setData(loadedData);
    setHeaders(loadedHeaders);
    // Auto-select first string column for X and first numeric for Y
    const firstString = loadedHeaders.find(h => 
      loadedData.some(row => typeof row[h] === 'string')
    );
    const firstNumeric = loadedHeaders.find(h => 
      loadedData.some(row => typeof row[h] === 'number')
    );
    if (firstString) setXAxis(firstString);
    if (firstNumeric) {
      setYAxis([firstNumeric]);
      setPieValueColumn(firstNumeric);
    }
    if (firstString) setPieLabelColumn(firstString);
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('excelData');
    if (savedData) {
      try {
        const { data: savedDataRows, headers: savedHeaders } = JSON.parse(savedData);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(savedDataRows);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHeaders(savedHeaders);
        // Auto-select columns
        const firstString = savedHeaders.find((h: string) => 
          savedDataRows.some((row: Record<string, unknown>) => typeof row[h] === 'string')
        );
        const firstNumeric = savedHeaders.find((h: string) => 
          savedDataRows.some((row: Record<string, unknown>) => typeof row[h] === 'number')
        );
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (firstString) setXAxis(firstString);
        if (firstNumeric) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setYAxis([firstNumeric]);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPieValueColumn(firstNumeric);
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (firstString) setPieLabelColumn(firstString);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
  }, []);

  // Get numeric and string columns
  const numericColumns = useMemo(() => {
    return headers.filter(header => 
      data.some(row => typeof row[header] === 'number')
    );
  }, [headers, data]);

  const allColumns = headers;

  // Prepare chart data based on type
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    if (chartType === 'pie') {
      if (!pieValueColumn || !pieLabelColumn) return null;
      return data.map((row, idx) => ({
        id: idx,
        value: Number(row[pieValueColumn]) || 0,
        label: String(row[pieLabelColumn] || ''),
      }));
    }

    if (chartType === 'scatter') {
      if (yAxis.length === 0 || !xAxis) return null;
      return yAxis.map(col => ({
        label: col,
        data: data.map((row, idx) => ({
          id: idx,
          x: Number(row[xAxis]) || 0,
          y: Number(row[col]) || 0,
        })),
      }));
    }

    // Bar, Line charts
    if (!xAxis || yAxis.length === 0) return null;
    
    return {
      categories: data.map(row => String(row[xAxis] || '')),
      series: yAxis.map(col => ({
        data: data.map(row => Number(row[col]) || 0),
        label: col,
        stack: stackedBars ? 'A' : undefined,
        area: fillArea,
        curve: curveType,
        showMark: showMarkers,
      })),
    };
  }, [data, chartType, xAxis, yAxis, pieValueColumn, pieLabelColumn, stackedBars, fillArea, curveType, showMarkers]);

  const handleYAxisToggle = (column: string) => {
    setYAxis(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader onDataLoaded={handleDataLoaded} />
        <main className="max-w-7xl mx-auto p-8">
          <div className="text-center text-gray-500 mt-12 p-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-2xl font-semibold mb-2">No Data Loaded</p>
            <p className="text-lg">Click &quot;Load Excel File&quot; in the header to upload your data</p>
            <p className="text-sm mt-4 text-gray-400">
              Once loaded, you can create custom charts with full control over all parameters
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onDataLoaded={handleDataLoaded} />
      <main className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Custom Chart Builder</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Chart Type */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Chart Type</h3>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="scatter">Scatter Chart</option>
              </select>
            </div>

            {/* Axis Configuration */}
            {chartType !== 'pie' && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Axis Configuration</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    X-Axis {chartType === 'scatter' ? '(Numeric)' : '(Category)'}
                  </label>
                  <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select column...</option>
                    {(chartType === 'scatter' ? numericColumns : allColumns).map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Y-Axis (Numeric) - Multiple
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                    {numericColumns.map(col => (
                      <label key={col} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={yAxis.includes(col)}
                          onChange={() => handleYAxisToggle(col)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{col}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pie Chart Configuration */}
            {chartType === 'pie' && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-3">Pie Chart Settings</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Value Column</label>
                  <select
                    value={pieValueColumn}
                    onChange={(e) => setPieValueColumn(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select column...</option>
                    {numericColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Label Column</label>
                  <select
                    value={pieLabelColumn}
                    onChange={(e) => setPieLabelColumn(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select column...</option>
                    {allColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Inner Radius: {innerRadius}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={innerRadius}
                    onChange={(e) => setInnerRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Outer Radius: {outerRadius}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={outerRadius}
                    onChange={(e) => setOuterRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Visual Settings */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Visual Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Chart Height: {chartHeight}px
                </label>
                <input
                  type="range"
                  min="300"
                  max="800"
                  value={chartHeight}
                  onChange={(e) => setChartHeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLegend}
                    onChange={(e) => setShowLegend(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Show Legend</span>
                </label>

                {showLegend && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium mb-2">Legend Position</label>
                    <select
                      value={legendPosition}
                      onChange={(e) => setLegendPosition(e.target.value as typeof legendPosition)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                )}

                {chartType !== 'pie' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Show Grid</span>
                  </label>
                )}

                {chartType === 'bar' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stackedBars}
                      onChange={(e) => setStackedBars(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Stack Bars</span>
                  </label>
                )}

                {chartType === 'line' && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showMarkers}
                        onChange={(e) => setShowMarkers(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Show Markers</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fillArea}
                        onChange={(e) => setFillArea(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Fill Area</span>
                    </label>

                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-2">Curve Type</label>
                      <select
                        value={curveType}
                        onChange={(e) => setCurveType(e.target.value as typeof curveType)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option value="linear">Linear</option>
                        <option value="natural">Natural</option>
                        <option value="monotoneX">Monotone X</option>
                        <option value="monotoneY">Monotone Y</option>
                        <option value="step">Step</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Chart Display */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Chart Preview</h3>
              
              {!chartData && (
                <div className="text-center text-gray-500 py-12">
                  <p>Configure the chart parameters on the left to see your chart</p>
                </div>
              )}

              {chartData && chartType === 'bar' && 'categories' in chartData && (
                <BarChart
                  xAxis={[{ 
                    scaleType: 'band', 
                    data: chartData.categories,
                  }]}
                  series={chartData.series}
                  height={chartHeight}
                  grid={showGrid ? { horizontal: true } : undefined}
                  slotProps={{
                    legend: showLegend ? {
                      direction: 'row',
                      position: { vertical: legendPosition === 'top' || legendPosition === 'bottom' ? legendPosition : 'bottom', horizontal: legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'middle' },
                    } : { hidden: true },
                  }}
                />
              )}

              {chartData && chartType === 'line' && 'categories' in chartData && (
                <LineChart
                  xAxis={[{ 
                    scaleType: 'band', 
                    data: chartData.categories,
                  }]}
                  series={chartData.series}
                  height={chartHeight}
                  grid={showGrid ? { horizontal: true } : undefined}
                  slotProps={{
                    legend: showLegend ? {
                      direction: 'row',
                      position: { vertical: legendPosition === 'top' || legendPosition === 'bottom' ? legendPosition : 'bottom', horizontal: legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'middle' },
                    } : { hidden: true },
                  }}
                />
              )}

              {chartData && chartType === 'pie' && Array.isArray(chartData) && chartData.every(d => 'value' in d) && (
                <PieChart
                  series={[{
                    data: chartData as { id: number; value: number; label: string }[],
                    innerRadius: innerRadius,
                    outerRadius: outerRadius,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                  }]}
                  height={chartHeight}
                  slotProps={{
                    legend: showLegend ? {
                      direction: 'row',
                      position: { vertical: legendPosition === 'top' || legendPosition === 'bottom' ? legendPosition : 'bottom', horizontal: legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'middle' },
                    } : { hidden: true },
                  }}
                />
              )}

              {chartData && chartType === 'scatter' && Array.isArray(chartData) && !chartData.every((d: { label?: string; data?: unknown; value?: unknown }) => 'value' in d) && (
                <ScatterChart
                  series={chartData as { label: string; data: { id: number; x: number; y: number }[] }[]}
                  height={chartHeight}
                  grid={showGrid ? { horizontal: true, vertical: true } : undefined}
                  slotProps={{
                    legend: showLegend ? {
                      direction: 'row',
                      position: { vertical: legendPosition === 'top' || legendPosition === 'bottom' ? legendPosition : 'bottom', horizontal: legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'middle' },
                    } : { hidden: true },
                  }}
                />
              )}
            </div>

            {/* Configuration Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📋 Current Configuration</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Chart Type:</strong> {chartType.charAt(0).toUpperCase() + chartType.slice(1)}</p>
                {chartType !== 'pie' && (
                  <>
                    <p><strong>X-Axis:</strong> {xAxis || 'Not selected'}</p>
                    <p><strong>Y-Axis:</strong> {yAxis.length > 0 ? yAxis.join(', ') : 'None selected'}</p>
                  </>
                )}
                {chartType === 'pie' && (
                  <>
                    <p><strong>Value:</strong> {pieValueColumn || 'Not selected'}</p>
                    <p><strong>Labels:</strong> {pieLabelColumn || 'Not selected'}</p>
                  </>
                )}
                <p><strong>Height:</strong> {chartHeight}px</p>
                <p><strong>Data Points:</strong> {data.length}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
