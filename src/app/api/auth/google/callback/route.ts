import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/dashboard/testing?error=No code provided');
  }

  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return NextResponse.redirect('/dashboard/testing');
  } catch (error) {
    console.error('Error in callback:', error);
    return NextResponse.redirect('/dashboard/testing?error=Authentication failed');
  }
} 