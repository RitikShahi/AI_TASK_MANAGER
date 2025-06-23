import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, email, displayName, photoURL } = await request.json();

    if (!firebaseUid || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    if (existingUser.length === 0) {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          firebaseUid,
          email,
          displayName,
          photoURL,
        })
        .returning();

      return NextResponse.json(newUser[0], { status: 201 });
    } else {
      // Update existing user
      const updatedUser = await db
        .update(users)
        .set({
          email,
          displayName,
          photoURL,
          updatedAt: new Date(),
        })
        .where(eq(users.firebaseUid, firebaseUid))
        .returning();

      return NextResponse.json(updatedUser[0]);
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
