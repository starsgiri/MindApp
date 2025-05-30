import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function getAuth(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = request.headers.get('authorization')?.split(' ')[1] || 
                 cookieStore.get('token')?.value;

    if (!token) {
      return { isAuthenticated: false, userId: null };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return { isAuthenticated: true, userId: decoded.userId };
  } catch (error) {
    return { isAuthenticated: false, userId: null };
  }
}
