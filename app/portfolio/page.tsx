'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { DataGridPremium, GridColDef, GridToolbar } from '@mui/x-data-grid-premium';
import { LicenseInfo } from '@mui/x-license';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ExcelData } from '../types/excel';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Set MUI X license key
LicenseInfo.setLicenseKey('e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y');

// Dynamically import ReactGridLayout to avoid SSR issues
const ReactGridLayout = dynamic(() => import('react-grid-layout'), { ssr: false });

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface FormulaParam {
  name: string;
  formula: string;
}

const STORAGE_KEY_LAYOUT = 'portfolio-chart-layout';
const STORAGE_KEY_DATA = 'portfolio-data';
const STORAGE_KEY_FORMULAS = 'portfolio-formulas';

export default function PortfolioPage() {
  const [data, setData] = useState<ExcelData>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [formulas, setFormulas] = useState<FormulaParam[]>([]);
  const [newParamName, setNewParamName] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [layout, setLayout] = useState<LayoutItem[]>([
    { i: 'grid', x: 0, y: 0, w: 12, h: 4 },
    { i: 'chart1', x: 0, y: 4, w: 6, h: 4 },
    { i: 'chart2', x: 6, y: 4, w: 6, h: 4 },
  ]);

  // Load saved data and layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem(STORAGE_KEY_LAYOUT);
    const savedData = localStorage.getItem(STORAGE_KEY_DATA);
    const savedFormulas = localStorage.getItem(STORAGE_KEY_FORMULAS);

    if (savedLayout) {
      try {
        setLayout(JSON.parse(savedLayout));
      } catch (e) {
        console.error('Failed to parse saved layout:', e);
      }
    }

    if (savedData) {
      try {
        const { data: savedDataRows, headers: savedHeaders } = JSON.parse(savedData);
        setData(savedDataRows);
        setHeaders(savedHeaders);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }

    if (savedFormulas) {
      try {
        setFormulas(JSON.parse(savedFormulas));
      } catch (e) {
        console.error('Failed to parse saved formulas:', e);
      }
    }
  }, []);

  // Sample fixed income data initialization
  useEffect(() => {
    if (data.length === 0) {
      const sampleData: ExcelData = [
        { 
          Ticker: 'BOND-A', 
          Coupon: 5.5, 
          Maturity: 10, 
          Price: 98.5, 
          Yield: 5.8, 
          Duration: 8.2, 
          Convexity: 75.3, 
          Rating: 'AAA'
        },
        { 
          Ticker: 'BOND-B', 
          Coupon: 4.2, 
          Maturity: 5, 
          Price: 102.3, 
          Yield: 3.8, 
          Duration: 4.5, 
          Convexity: 25.1, 
          Rating: 'AA'
        },
        { 
          Ticker: 'BOND-C', 
          Coupon: 6.8, 
          Maturity: 15, 
          Price: 95.2, 
          Yield: 7.3, 
          Duration: 11.5, 
          Convexity: 145.8, 
          Rating: 'A'
        },
        { 
          Ticker: 'BOND-D', 
          Coupon: 3.5, 
          Maturity: 3, 
          Price: 99.8, 
          Yield: 3.6, 
          Duration: 2.8, 
          Convexity: 8.9, 
          Rating: 'AAA'
        },
        { 
          Ticker: 'BOND-E', 
          Coupon: 7.2, 
          Maturity: 20, 
          Price: 91.5, 
          Yield: 8.1, 
          Duration: 14.3, 
          Convexity: 225.6, 
          Rating: 'BBB'
        },
        { 
          Ticker: 'BOND-F', 
          Coupon: 4.8, 
          Maturity: 7, 
          Price: 100.5, 
          Yield: 4.7, 
          Duration: 6.2, 
          Convexity: 48.2, 
          Rating: 'AA'
        },
        { 
          Ticker: 'BOND-G', 
          Coupon: 5.0, 
          Maturity: 12, 
          Price: 97.8, 
          Yield: 5.4, 
          Duration: 9.5, 
          Convexity: 98.7, 
          Rating: 'A'
        },
        { 
          Ticker: 'BOND-H', 
          Coupon: 3.9, 
          Maturity: 4, 
          Price: 101.2, 
          Yield: 3.5, 
          Duration: 3.7, 
          Convexity: 15.4, 
          Rating: 'AAA'
        },
      ];
      const sampleHeaders = Object.keys(sampleData[0]);
      setData(sampleData);
      setHeaders(sampleHeaders);
    }
  }, [data.length]);

  // Apply formulas to calculate new columns
  const processedData = useMemo(() => {
    if (formulas.length === 0) return data;

    return data.map(row => {
      const newRow = { ...row };
      formulas.forEach(({ name, formula }) => {
        try {
          // Simple formula evaluation (supports basic arithmetic with column names)
          let expression = formula;
          headers.forEach(header => {
            const value = row[header];
            if (typeof value === 'number') {
              expression = expression.replace(new RegExp(`\\b${header}\\b`, 'g'), String(value));
            }
          });
          // Evaluate the expression safely (only numeric operations)
          if (/^[\d\s+\-*/.()]+$/.test(expression)) {
            // eslint-disable-next-line no-eval
            newRow[name] = eval(expression);
          } else {
            newRow[name] = 'Invalid formula';
          }
        } catch {
          newRow[name] = 'Error';
        }
      });
      return newRow;
    });
  }, [data, formulas, headers]);

  const allHeaders = useMemo(() => {
    return [...headers, ...formulas.map(f => f.name)];
  }, [headers, formulas]);

  const columns: GridColDef[] = useMemo(() => {
    return allHeaders.map((header) => ({
      field: header,
      headerName: header,
      width: 130,
      editable: !formulas.some(f => f.name === header),
      filterable: true,
      sortable: true,
      hideable: true,
    }));
  }, [allHeaders, formulas]);

  const rows = useMemo(() => {
    return processedData.map((row, index) => ({
      id: index,
      ...row
    }));
  }, [processedData]);

  // Get numeric columns for charting
  const numericColumns = useMemo(() => {
    return allHeaders.filter(header => {
      return processedData.some(row => typeof row[header] === 'number');
    });
  }, [allHeaders, processedData]);

  const categoryColumn = useMemo(() => {
    return allHeaders.find(header => {
      return processedData.some(row => typeof row[header] === 'string');
    }) || allHeaders[0];
  }, [allHeaders, processedData]);

  // Chart 1 data
  const chart1Data = useMemo(() => {
    const cols = numericColumns.slice(0, 3);
    return {
      categories: processedData.map(row => String(row[categoryColumn] || '')),
      series: cols.map(col => ({
        data: processedData.map(row => Number(row[col]) || 0),
        label: col,
      })),
    };
  }, [processedData, numericColumns, categoryColumn]);

  // Chart 2 data
  const chart2Data = useMemo(() => {
    const cols = numericColumns.slice(3, 6);
    return {
      categories: processedData.map(row => String(row[categoryColumn] || '')),
      series: cols.map(col => ({
        data: processedData.map(row => Number(row[col]) || 0),
        label: col,
      })),
    };
  }, [processedData, numericColumns, categoryColumn]);

  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    setLayout(newLayout);
    localStorage.setItem(STORAGE_KEY_LAYOUT, JSON.stringify(newLayout));
  };

  const handleAddFormula = () => {
    if (newParamName && newFormula) {
      const newFormulas = [...formulas, { name: newParamName, formula: newFormula }];
      setFormulas(newFormulas);
      localStorage.setItem(STORAGE_KEY_FORMULAS, JSON.stringify(newFormulas));
      setNewParamName('');
      setNewFormula('');
    }
  };

  const handleRemoveFormula = (name: string) => {
    const newFormulas = formulas.filter(f => f.name !== name);
    setFormulas(newFormulas);
    localStorage.setItem(STORAGE_KEY_FORMULAS, JSON.stringify(newFormulas));
  };

  const handleDataChange = (newData: ExcelData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify({ data: newData, headers }));
  };

  const handleCellEdit = (params: { id: number; field: string; value: string | number | Date | null | undefined }) => {
    const newData = [...data];
    const rowIndex = params.id;
    newData[rowIndex] = { ...newData[rowIndex], [params.field]: params.value };
    handleDataChange(newData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Portfolio Analysis - Fixed Income
          </h1>
          <Link 
            href="/" 
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            ← Back to Main
          </Link>
        </div>

        {/* Formula Builder */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Formula Builder</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Parameter Name</label>
              <input
                type="text"
                value={newParamName}
                onChange={(e) => setNewParamName(e.target.value)}
                placeholder="e.g., YieldSpread"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Formula</label>
              <input
                type="text"
                value={newFormula}
                onChange={(e) => setNewFormula(e.target.value)}
                placeholder="e.g., Yield - Coupon"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddFormula}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Formula
              </button>
            </div>
          </div>
          {formulas.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Active Formulas:</h3>
              <div className="space-y-2">
                {formulas.map((formula) => (
                  <div key={formula.name} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="font-mono text-sm">
                      {formula.name} = {formula.formula}
                    </span>
                    <button
                      onClick={() => handleRemoveFormula(formula.name)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Available columns: {headers.join(', ')}. Use column names in formulas with +, -, *, / operators.
          </p>
        </div>

        {/* Draggable Grid Layout */}
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          width={1700}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".drag-handle"
        >
          <div key="grid" className="bg-white rounded-lg shadow overflow-hidden">
            <div className="drag-handle bg-blue-600 text-white px-4 py-2 cursor-move font-semibold">
              📊 Data Grid (Drag to Move)
            </div>
            <div style={{ height: 'calc(100% - 40px)', width: '100%' }}>
              <DataGridPremium
                rows={rows}
                columns={columns}
                pagination
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
                processRowUpdate={handleCellEdit}
                slots={{
                  toolbar: GridToolbar,
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                density="compact"
              />
            </div>
          </div>

          <div key="chart1" className="bg-white rounded-lg shadow overflow-hidden">
            <div className="drag-handle bg-green-600 text-white px-4 py-2 cursor-move font-semibold">
              📈 Chart 1: Primary Metrics (Drag to Move)
            </div>
            <div style={{ height: 'calc(100% - 40px)', width: '100%', padding: '16px' }}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: chart1Data.categories }]}
                series={chart1Data.series}
                height={300}
              />
            </div>
          </div>

          <div key="chart2" className="bg-white rounded-lg shadow overflow-hidden">
            <div className="drag-handle bg-purple-600 text-white px-4 py-2 cursor-move font-semibold">
              📉 Chart 2: Secondary Metrics (Drag to Move)
            </div>
            <div style={{ height: 'calc(100% - 40px)', width: '100%', padding: '16px' }}>
              <LineChart
                xAxis={[{ scaleType: 'band', data: chart2Data.categories }]}
                series={chart2Data.series}
                height={300}
              />
            </div>
          </div>
        </ReactGridLayout>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            💡 <strong>Tip:</strong> Drag the colored headers to reposition elements. Resize by dragging the bottom-right corner. 
            Your layout is automatically saved to localStorage!
          </p>
        </div>
      </main>
    </div>
  );
}
