import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const connection = await pool.getConnection();
    
    // Check if user already exists
    const [existingUsers]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result]: any = await connection.execute(
      'INSERT INTO users (name, email, password_hash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, new Date(), new Date()]
    );
    
    connection.release();

    return NextResponse.json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
