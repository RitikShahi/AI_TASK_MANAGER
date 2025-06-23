import { NextRequest, NextResponse } from 'next/server';
import { generateTasks } from '@/lib/gemini';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { topic, firebaseUid } = await request.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' }, 
        { status: 400 }
      );
    }

    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'User authentication required' }, 
        { status: 401 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please add GEMINI_API_KEY to environment variables.' }, 
        { status: 500 }
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
        { error: 'User not found. Please sign in again.' }, 
        { status: 404 }
      );
    }

    // Generate tasks using Gemini AI with better error handling
    let generatedTaskTitles: string[];
    try {
      generatedTaskTitles = await generateTasks(topic);
    } catch (aiError: any) {
      console.error('AI Generation Error:', aiError);
      return NextResponse.json(
        { error: aiError.message || 'Failed to generate tasks with AI' }, 
        { status: 500 }
      );
    }

    // Save tasks to database
    const newTasks = await db
      .insert(tasks)
      .values(
        generatedTaskTitles.map((taskTitle) => ({
          title: taskTitle,
          userId: user[0].id,
          generatedTopic: topic,
          priority: 'medium' as const,
          isCompleted: false,
        }))
      )
      .returning();

    return NextResponse.json({
      message: `Generated ${newTasks.length} tasks for "${topic}"`,
      tasks: newTasks,
      topic: topic,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in task generation API:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' }, 
      { status: 500 }
    );
  }
}
