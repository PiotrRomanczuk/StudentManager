import { NextResponse } from 'next/server';
import { getActiveUsers } from '@/utils/auth-helpers';

export async function GET() {
  try {
    const activeUsers = await getActiveUsers();
    
    return NextResponse.json({
      success: true,
      data: activeUsers,
      count: activeUsers.length
    });
  } catch (error) {
    console.error('Error in active-users API:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (error.message === 'Admin access required') {
        return NextResponse.json(
          { success: false, error: 'Admin access required' },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 