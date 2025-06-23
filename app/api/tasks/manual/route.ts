import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { title, description, priority, dueDate, firebaseUid } = await request.json();

    if (!title || !firebaseUid) {
      return NextResponse.json(
        { error: 'Title and authentication are required' }, 
        { status: 400 }
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

    // Create manual task
    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description: description || null,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user[0].id,
        isCompleted: false,
        generatedTopic: null, // Manual tasks don't have AI topics
      })
      .returning();

    return NextResponse.json({
      message: 'Task created successfully',
      task: newTask[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating manual task:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
