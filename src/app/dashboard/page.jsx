// app/dashboard/page.js
// THE PRIVATE ROOM - Only logged-in users can see this

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/BookmarkList'
import BookmarkForm from '@/components/BookmarkForm'


export default async function Dashboard() {
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

  // Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  
  // If no user, send to home page
  if (!user) {
    redirect('/')
  }

  return (
    <div className="space-y-8 pt-25 md:pt-35 pb-8 px-4 md:px-120">
    
      {/* Add Bookmark Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-1">
          <span className="w-7 md:w-9 text-[#0F172A]">
            <svg className='w-full h-full' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 6V18M18 12H6" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
          </span>
          Add New Bookmark
        </h2>
        <BookmarkForm userId={user.id} />
      </div>
      
      {/* Bookmarks List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#0F172A] w-5 md:w-7">
            <svg fill="currentcolor" className='w-full h-full' viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 14h-2c-0.552 0-1 0.448-1 1v2c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-2c0-0.552-0.448-1-1-1zM31 15h-21c-0.552 0-1 0.448-1 1s0.448 1 1 1h21c0.552 0 1-0.448 1-1s-0.448-1-1-1zM3 22h-2c-0.552 0-1 0.448-1 1v2c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-2c0-0.552-0.448-1-1-1zM31 23h-21c-0.552 0-1 0.448-1 1s0.448 1 1 1h21c0.552 0 1-0.448 1-1s-0.448-1-1-1zM3 6h-2c-0.552 0-1 0.448-1 1v2c0 0.552 0.448 1 1 1h2c0.552 0 1-0.448 1-1v-2c0-0.552-0.448-1-1-1zM10 9h21c0.552 0 1-0.448 1-1s-0.448-1-1-1h-21c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
</svg>
          </span>
          Your Bookmarks
        </h2>
        <BookmarkList userId={user.id} />
      </div>
    </div>
  )
}