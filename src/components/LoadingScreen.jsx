"use client"

import { useEffect, useState } from "react"

const LoadingScreen = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#F8FAFC] flex flex-col gap-2 md:gap-5 items-center justify-center text-2xl">
       <div className="flex">
        <div className='w-8 md:w-15'>
          <svg className='w-full h-full' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 2C4.44772 2 4 2.44772 4 3V21C4 21.3565 4.18976 21.686 4.49807 21.8649C4.80639 22.0438 5.18664 22.0451 5.49614 21.8682L10.5116 19.0023C11.4339 18.4752 12.5661 18.4752 13.4884 19.0023L18.5039 21.8682C18.8134 22.0451 19.1936 22.0438 19.5019 21.8649C19.8102 21.686 20 21.3565 20 21V3C20 2.44772 19.5523 2 19 2H5Z" fill="#4296FF"/>
</svg>
        </div>
        <p className="text-[#0F172A] text-xl font-bold md:text-5xl">Smart <span className="text-[#4296FF]">Bookmark</span></p>
       </div>
        <div className="w-10 h-10 md:w-15 md:h-15 rounded-full border-6 border-[#4296FF] border-t-transparent animate-spin">

        </div>
      </div>
    )
  }

  return children
}

export default LoadingScreen