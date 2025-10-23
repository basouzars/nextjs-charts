import { NextRequest, NextResponse } from 'next/server';
import { getChartData } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tableName = searchParams.get('table');
    const xColumn = searchParams.get('xColumn');
    const yColumn = searchParams.get('yColumn');
    
    if (!tableName || !xColumn || !yColumn) {
      return NextResponse.json(
        { error: 'Table name, xColumn, and yColumn are required' },
        { status: 400 }
      );
    }
    
    const data = getChartData(tableName, xColumn, yColumn);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Chart data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
