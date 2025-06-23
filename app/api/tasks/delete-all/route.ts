import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid } = await request.json();

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const deletedTasks = await db
      .delete(tasks)
      .where(eq(tasks.userId, user[0].id))
      .returning();

    return NextResponse.json({ 
      message: `Successfully deleted ${deletedTasks.length} tasks`,
      deletedCount: deletedTasks.length 
    });
  } catch (error) {
    console.error('Error deleting all tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
