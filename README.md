# Excel Data Grids & Charts Comparison

A Next.js 15 application that allows you to upload Excel files and compare data grid and charting libraries side-by-side.

## Features

### Data Grids
- **AG Grid Enterprise** - Full-featured data grid with:
  - Advanced filtering and sorting
  - Row grouping and pivoting
  - Column management sidebar
  - Status bar with aggregations
  - Range selection
  - Built-in charting
  - Pagination

- **MUI X Data Grid Premium** - Material-UI data grid with:
  - Quick search functionality
  - Column management
  - Advanced filtering
  - Density controls
  - Export capabilities
  - Grouping and aggregation
  - Pagination

### Charts
- **AG Charts** - Enterprise-grade charts with interactive legends
- **MUI X Charts** - Material Design charts with responsive layouts
- **ECharts (Apache)** - Open-source charting library with rich visualizations

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Usage

1. Click "Choose File" to upload an Excel file (.xlsx or .xls)
2. View your data in both AG Grid and MUI Data Grid Premium
3. Compare visualizations across AG Charts, MUI Charts, and ECharts
4. Use the advanced features of each grid:
   - Sort, filter, and search data
   - Group rows by dragging columns
   - Export data
   - Customize column visibility
   - And much more!

## Sample Data

A sample Excel file is included at `public/samples/sample-data.xlsx` with sales data to test the features.

## Technology Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Grids**:
  - AG Grid Community & Enterprise v32.3.3
  - MUI X Data Grid Premium v7.24.0
- **Charts**:
  - AG Charts Enterprise v10.3.3
  - MUI X Charts v7.24.0
  - ECharts v5.5.1
- **Excel Parsing**: ExcelJS v4.4.0

## License Notes

- AG Grid and AG Charts use trial licenses for evaluation purposes
- MUI X uses a trial license for evaluation purposes
- For production use, obtain proper licenses from [AG Grid](https://ag-grid.com/licensing/) and [MUI](https://mui.com/x/introduction/licensing/)

## Security

This application uses ExcelJS (v4.4.0) for secure Excel file parsing, avoiding known vulnerabilities in older xlsx packages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

