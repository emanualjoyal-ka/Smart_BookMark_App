import FeatureGrid from '@/components/FeatureGrid'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  // Check if user is already logged in
  const cookieStore = cookies()
  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  //   {
  //     cookies: {
  //       get(name) {
  //         return cookieStore.get(name)?.value
  //       },
  //     },
  //   }
  // )

  // const { data: { user } } = await supabase.auth.getUser()
  
  // If logged in, go to dashboard
  // if (user) {
  //   redirect('/dashboard')
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-25 md:py-12 px-4">
      <div className="text-center border-2 shadow-lg border-[#EFF6FF] px-7 pb-10 rounded-l-md rounded-tr-4xl">
        <div>
          <div className='w-6 md:w-10'>
          <svg className='w-full h-full' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 2C4.44772 2 4 2.44772 4 3V21C4 21.3565 4.18976 21.686 4.49807 21.8649C4.80639 22.0438 5.18664 22.0451 5.49614 21.8682L10.5116 19.0023C11.4339 18.4752 12.5661 18.4752 13.4884 19.0023L18.5039 21.8682C18.8134 22.0451 19.1936 22.0438 19.5019 21.8649C19.8102 21.686 20 21.3565 20 21V3C20 2.44772 19.5523 2 19 2H5Z" fill="#4296FF"/>
</svg>
        </div>
        <h1 className="text-5xl font-bold text-[#0F172A] mb-6">
          Smart <span className='text-[#4296FF]'>Bookmark</span>
        </h1>
        </div>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Save, organize, and access your favorite websites from anywhere. 
          Your personal bookmark collection, always with you.
        </p>
        
        {/* Feature Grid */}
        <FeatureGrid/>
        
        <div className="mt-12 p-8 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Sign in with Google to create your personal bookmark collection
          </p>
          {/* Auth button will appear from layout */}
        </div>
      </div>
    </div>
  )
}