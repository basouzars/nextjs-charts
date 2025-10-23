'use client';

import { useState, ChangeEvent, useRef } from 'react';
import * as ExcelJS from 'exceljs';
import { ExcelData } from '../types/excel';

interface ExcelUploaderProps {
  onDataLoaded: (data: ExcelData, headers: string[]) => void;
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

export default function ExcelUploader({ onDataLoaded }: ExcelUploaderProps) {
  const [fileName, setFileName] = useState<string>('');
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
              // Check if the string represents a number (including negative, with . or , as separators)
              const numericPattern = /^-?[\d,]+\.?\d*$|^-?\d*\.[\d,]+$/;
              if (numericPattern.test(value.trim())) {
                // Remove commas and convert to number
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

      onDataLoaded(data, headers);
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
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Excel File</h2>
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {fileName && (
          <span className="text-sm text-gray-600">Loaded: {fileName}</span>
        )}
      </div>
    </div>
  );
}
