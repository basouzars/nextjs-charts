'use client';

import { useState } from 'react';
import AppHeader from './components/AppHeader';
import IntegratedDataView from './components/IntegratedDataView';
import { ExcelData } from './types/excel';

// Load initial data from localStorage
function getInitialData(): { data: ExcelData; headers: string[] } {
  if (typeof window === 'undefined') {
    return { data: [], headers: [] };
  }
  
  const savedData = localStorage.getItem('excelData');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      return { data: parsed.data || [], headers: parsed.headers || [] };
    } catch (e) {
      console.error('Failed to parse saved data:', e);
    }
  }
  return { data: [], headers: [] };
}

export default function Home() {
  const [data, setData] = useState<ExcelData>(() => getInitialData().data);
  const [headers, setHeaders] = useState<string[]>(() => getInitialData().headers);

  const handleDataLoaded = (loadedData: ExcelData, loadedHeaders: string[]) => {
    setData(loadedData);
    setHeaders(loadedHeaders);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onDataLoaded={handleDataLoaded} />
      <main className="max-w-7xl mx-auto p-8">
        {data.length > 0 ? (
          <IntegratedDataView data={data} headers={headers} />
        ) : (
          <div className="text-center text-gray-500 mt-12 p-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-2xl font-semibold mb-2">No Data Loaded</p>
            <p className="text-lg">Click &quot;Load Excel File&quot; in the header to upload your data</p>
            <p className="text-sm mt-4 text-gray-400">
              Once loaded, you&apos;ll see your data in an interactive grid with integrated charts
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
