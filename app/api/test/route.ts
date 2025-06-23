import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // ✅ Fixed: Use sql template instead of raw string
    const result = await db.execute(sql`SELECT NOW()`);
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
