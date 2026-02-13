import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach((cookie) => {
                const name = cookie.name
                const value = cookie.value
                const options = cookie.options

                cookieStore.set(name, value, options)
            })
          } catch{
            // ignore if called in Server Component, as cookies are only available in API routes and Server Actions
          }
        },
      },
    }
  )
}
