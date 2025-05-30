import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const auth = await getAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();
    const userId = auth.userId;

    const connection = await pool.getConnection();
    const [result]: any = await connection.execute(
      'INSERT INTO entries (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())',
      [userId, title, content]
    );
    connection.release();

    return NextResponse.json({
      message: 'Entry created successfully',
      entryId: result.insertId
    });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const auth = await getAuth(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC',
      [auth.userId]
    );
    connection.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
