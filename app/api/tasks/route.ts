import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid } = await request.json();

    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'User authentication required' }, 
        { status: 401 }
      );
    }

    // Find user in database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Fetch user's tasks
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, user[0].id))
      .orderBy(desc(tasks.createdAt));

    return NextResponse.json({
      tasks: userTasks,
      count: userTasks.length,
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
