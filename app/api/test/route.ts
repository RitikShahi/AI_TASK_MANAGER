import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const result = await db.execute('SELECT NOW()');
    return NextResponse.json({ 
      message: 'Database connected successfully',
      timestamp: result.rows[0] 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error 
    }, { status: 500 });
  }
}
