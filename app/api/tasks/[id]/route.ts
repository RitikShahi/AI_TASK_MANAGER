import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { firebaseUid, isCompleted, title, description, priority } = await request.json();
    
    if (!firebaseUid) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update task
    const updatedTask = await db
      .update(tasks)
      .set({
        isCompleted,
        title,
        description,
        priority,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, parseInt(params.id)), eq(tasks.userId, user[0].id)))
      .returning();

    if (!updatedTask.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { firebaseUid } = await request.json();
    
    if (!firebaseUid) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete task
    const deletedTask = await db
      .delete(tasks)
      .where(and(eq(tasks.id, parseInt(params.id)), eq(tasks.userId, user[0].id)))
      .returning();

    if (!deletedTask.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
