'use client';

import { useState, ChangeEvent } from 'react';
import * as ExcelJS from 'exceljs';
import { ExcelData } from '../types/excel';

interface ExcelUploaderProps {
  onDataLoaded: (data: ExcelData, headers: string[]) => void;
}

export default function ExcelUploader({ onDataLoaded }: ExcelUploaderProps) {
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.worksheets[0];
      const data: ExcelData = [];
      const headers: string[] = [];

      // Get headers from first row
      const firstRow = worksheet.getRow(1);
      firstRow.eachCell((cell, colNumber) => {
        headers.push(cell.value?.toString() || `Column${colNumber}`);
      });

      // Get data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          const rowData: Record<string, string | number | Date | null | undefined> = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            let value = cell.value as string | number | Date | null | undefined;
            
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
      alert('Error reading Excel file. Please make sure it\'s a valid Excel file.');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Excel File</h2>
      <div className="flex items-center gap-4">
        <input
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
