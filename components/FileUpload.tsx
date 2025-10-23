'use client';

import { useState } from 'react';
import { Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadProps {
  onUploadSuccess: (data: {
    tableName: string;
    rowCount: number;
    columns: string[];
  }) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUploadSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload Excel File
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload an .xlsx or .xls file to get started
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        component="label"
        variant="contained"
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        disabled={uploading}
        sx={{ mt: 2 }}
      >
        {uploading ? 'Uploading...' : 'Choose File'}
        <input
          type="file"
          hidden
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </Button>
    </Box>
  );
}
