'use client';

import { useState } from 'react';
import ExcelUploader from './components/ExcelUploader';
import AGGridView from './components/AGGridView';
import MUIDataGridView from './components/MUIDataGridView';
import AGChartsView from './components/AGChartsView';
import MUIChartsView from './components/MUIChartsView';
import EChartsView from './components/EChartsView';
import { ExcelData } from './types/excel';

export default function Home() {
  const [data, setData] = useState<ExcelData>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const handleDataLoaded = (loadedData: ExcelData, loadedHeaders: string[]) => {
    setData(loadedData);
    setHeaders(loadedHeaders);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Excel Data Grids & Charts Comparison
        </h1>
        
        <ExcelUploader onDataLoaded={handleDataLoaded} />

        {data.length > 0 && (
          <>
            <div className="space-y-8">
              <AGGridView data={data} headers={headers} />
              <MUIDataGridView data={data} headers={headers} />
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Charts Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AGChartsView data={data} headers={headers} />
                <MUIChartsView data={data} headers={headers} />
                <EChartsView data={data} headers={headers} />
              </div>
            </div>
          </>
        )}

        {data.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-lg">Upload an Excel file to see the grids and charts in action!</p>
          </div>
        )}
      </main>
    </div>
  );
}
