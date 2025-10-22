'use client';

import { useState } from 'react';
import Link from 'next/link';
import ExcelUploader from './components/ExcelUploader';
import IntegratedDataView from './components/IntegratedDataView';
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            MUI X Data Grid & Charts
          </h1>
          <Link 
            href="/portfolio" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Portfolio Analysis →
          </Link>
        </div>
        
        <ExcelUploader onDataLoaded={handleDataLoaded} />

        {data.length > 0 && (
          <IntegratedDataView data={data} headers={headers} />
        )}

        {data.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-lg">Upload an Excel file to see the integrated data grid and charts!</p>
            <p className="text-sm mt-2">Try the <Link href="/portfolio" className="text-blue-600 hover:underline">Portfolio Analysis</Link> page for custom formulas and parameters.</p>
          </div>
        )}
      </main>
    </div>
  );
}
