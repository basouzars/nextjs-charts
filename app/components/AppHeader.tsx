'use client';

import { useState, ChangeEvent, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as ExcelJS from 'exceljs';
import { ExcelData } from '../types/excel';

interface AppHeaderProps {
  onDataLoaded?: (data: ExcelData, headers: string[]) => void;
}

// Helper function to safely convert Excel cell values to usable formats
function getCellValue(cellValue: unknown): string | number | Date | null | undefined {
  if (cellValue === null || cellValue === undefined) {
    return cellValue;
  }
  
  // Handle rich text objects
  if (typeof cellValue === 'object' && cellValue !== null && 'richText' in cellValue) {
    const richText = cellValue as { richText: Array<{ text: string }> };
    return richText.richText.map(rt => rt.text).join('');
  }
  
  // Handle Date objects
  if (cellValue instanceof Date) {
    return cellValue;
  }
  
  // Handle formula results
  if (typeof cellValue === 'object' && cellValue !== null && 'result' in cellValue) {
    const formula = cellValue as { result: string | number };
    return formula.result;
  }
  
  // Handle error objects
  if (typeof cellValue === 'object' && cellValue !== null && 'error' in cellValue) {
    return null;
  }
  
  // For primitive types
  if (typeof cellValue === 'string' || typeof cellValue === 'number') {
    return cellValue;
  }
  
  // Convert boolean to string
  if (typeof cellValue === 'boolean') {
    return cellValue.toString();
  }
  
  // Fallback to string conversion for unknown object types
  return String(cellValue);
}

export default function AppHeader({ onDataLoaded }: AppHeaderProps) {
  const [fileName, setFileName] = useState<string>('');
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('No worksheet found in the Excel file');
      }
      
      const data: ExcelData = [];
      const headers: string[] = [];

      // Get headers from first row
      const firstRow = worksheet.getRow(1);
      firstRow.eachCell((cell, colNumber) => {
        const cellValue = getCellValue(cell.value);
        headers.push(cellValue?.toString() || `Column${colNumber}`);
      });

      // Get data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          const rowData: Record<string, string | number | Date | null | undefined> = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            let value = getCellValue(cell.value);
            
            // Convert numeric strings to numbers
            if (typeof value === 'string') {
              const numericPattern = /^-?[\d,]+\.?\d*$|^-?\d*\.[\d,]+$/;
              if (numericPattern.test(value.trim())) {
                const numericValue = parseFloat(value.replace(/,/g, ''));
                if (!isNaN(numericValue)) {
                  value = numericValue;
                }
              }
            }
            
            rowData[header] = value;
          });
          data.push(rowData);
        }
      });

      if (onDataLoaded) {
        onDataLoaded(data, headers);
      }

      // Also save to localStorage for other pages to access
      localStorage.setItem('excelData', JSON.stringify({ data, headers }));
    } catch (error) {
      console.error('Error reading Excel file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error reading Excel file: ${errorMessage}\n\nPlease make sure it's a valid Excel file (.xlsx or .xls)`);
      
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileName('');
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            MUI X Data Grid & Charts
          </h1>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-semibold"
            >
              📁 Load Excel File
            </label>
            {fileName && (
              <span className="text-sm text-gray-600">Loaded: {fileName}</span>
            )}
          </div>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              pathname === '/' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Data Grid View
          </Link>
          <Link
            href="/custom-charts"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              pathname === '/custom-charts' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Custom Charts
          </Link>
        </nav>
      </div>
    </header>
  );
}
