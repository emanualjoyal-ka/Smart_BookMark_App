// app/auth/callback/route.js
// THE WELCOME MAT - Where Google sends users back after signing in

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// This runs when Google redirects back to our app
export async function GET(request) {
  // Get the URL they came from
  const requestUrl = new URL(request.url)
  
  // Get the special code from Google
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // Get the cookie jar
   const cookieStore = await cookies()

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  }
)

    // Exchange the code for a session (like trading a ticket for a wristband)
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Send user to their dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}