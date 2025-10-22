'use client';

import { useState, useEffect } from 'react';
import AppHeader from './components/AppHeader';
import IntegratedDataView from './components/IntegratedDataView';
import { ExcelData } from './types/excel';

export default function Home() {
  const [data, setData] = useState<ExcelData>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const handleDataLoaded = (loadedData: ExcelData, loadedHeaders: string[]) => {
    setData(loadedData);
    setHeaders(loadedHeaders);
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
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
  }, []);

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
