import HomeClient from '@/components/HomeClient'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  // Check if user is already logged in
 const cookieStore = await cookies()

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
    },
  }
)

  const { data: { user } } = await supabase.auth.getUser()
  
  // If logged in, go to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <HomeClient/>
  )
}