import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function proxy(request) {
  let response = NextResponse.next()

  


  const supabase = createServerClient(
    
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
             cookiesToSet.forEach((cookie) => {
                const name = cookie.name
                const value = cookie.value
                const options = cookie.options

            response.cookies.set(name, value, options)
         
        })
        },
      },
    }
  )

  const res = await supabase.auth.getUser()
  const user = res?.data?.user

  const pathname = request.nextUrl.pathname

  // Protect dashboard
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect logged-in users away from home
  if (pathname === "/" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
}
