import { NextRequest, NextResponse } from 'next/server';
import { getTableColumns } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tableName = searchParams.get('table');
    
    if (!tableName) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      );
    }
    
    const columns = getTableColumns(tableName);
    
    return NextResponse.json({ columns });
  } catch (error) {
    console.error('Columns fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch columns' },
      { status: 500 }
    );
  }
}
