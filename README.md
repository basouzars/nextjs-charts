# MUI X Data Grid & Charts - Portfolio Analysis

A Next.js 16 application for analyzing fixed income portfolios with integrated data grids and charts. Features custom formula support, drag-and-drop layouts, and real-time data-to-chart integration.

## Features

### Data Grid
- **MUI X Data Grid Premium** - Full-featured data grid with:
  - Advanced filtering and sorting
  - Quick search functionality
  - Column management
  - Density controls
  - Export capabilities
  - Grouping and aggregation
  - Row selection with chart integration
  - Pagination
  - Inline editing

### Charts
- **MUI X Charts** - Material Design charts with:
  - Bar, Line, and Pie chart types
  - Real-time integration with data grid row selection
  - Multiple column selection for comparison
  - Responsive layouts

### Portfolio Analysis Page
- **Custom Formula Builder** - Define custom parameters with formulas
  - Create derived metrics from existing columns
  - Support for basic arithmetic operations (+, -, *, /)
  - Example: `YieldSpread = Yield - Coupon`
- **Drag-and-Drop Layout** - Fully customizable dashboard
  - Reposition charts and grids by dragging
  - Resize components by dragging corners
  - Layout automatically saved to localStorage
- **Fixed Income Optimized** - Designed for:
  - Wide tables with many parameters (10+ columns)
  - Compact data sets (~8 rows)
  - Bond analysis metrics (Coupon, Yield, Duration, Convexity, etc.)
  - Ticker-based comparisons

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

### Main Page
1. Upload an Excel file (.xlsx or .xls)
2. View your data in MUI Data Grid Premium
3. Select rows in the grid to filter chart data
4. Choose columns to visualize from the dropdown
5. Switch between Bar, Line, and Pie charts

### Portfolio Analysis Page
1. Click "Portfolio Analysis →" to access the custom formula builder
2. Define new parameters using formulas based on existing columns
   - Example: Create "YieldSpread" with formula "Yield - Coupon"
3. Drag chart and grid components to rearrange your dashboard
4. Resize components by dragging the bottom-right corner
5. Your layout is automatically saved and restored on next visit

### Sample Data
The portfolio page comes pre-loaded with 8 sample fixed income bonds including:
- Ticker symbols
- Coupon rates
- Maturity dates
- Prices
- Yields
- Duration
- Convexity
- Credit ratings

## Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Grid**: MUI X Data Grid Premium v7.24.0
- **Charts**: MUI X Charts v7.24.0
- **Layout**: react-grid-layout for drag-and-drop functionality
- **Excel Parsing**: ExcelJS v4.4.0

## License Notes

- MUI X uses a trial license for evaluation purposes
- For production use, obtain proper licenses from [MUI](https://mui.com/x/introduction/licensing/)

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

