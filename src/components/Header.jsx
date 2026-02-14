"use client"
import React from 'react'
import AuthButton from './AuthButton'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Header = ({user}) => {

  const timeline=gsap.timeline({defaults:{duration:1.5,delay:2}})

  useGSAP(()=>{
    timeline
    .from("#NavBar", {y:-100, opacity:0})
  })


  return (
    <div id='NavBar' className='py-4 md:py-3 px-4 bg-[#F8FAFC] z-[1] border-b-2 border-[#EFF6FF] shadow-md md:border-none md:shadow-none md:py-5 md:px-15 fixed top-0 w-full flex justify-between items-center'>
        <div id="texts" className="flex">
        <div className='w-6 md:w-10'>
          <svg className='w-full h-full' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 2C4.44772 2 4 2.44772 4 3V21C4 21.3565 4.18976 21.686 4.49807 21.8649C4.80639 22.0438 5.18664 22.0451 5.49614 21.8682L10.5116 19.0023C11.4339 18.4752 12.5661 18.4752 13.4884 19.0023L18.5039 21.8682C18.8134 22.0451 19.1936 22.0438 19.5019 21.8649C19.8102 21.686 20 21.3565 20 21V3C20 2.44772 19.5523 2 19 2H5Z" fill="#4296FF"/>
</svg>
        </div>
        <p className='text-xl md:text-3xl text-[#0F172A] tracking-wide font-bold'>Smart <span className="text-[#4296FF]">Bookmark</span></p>
        </div>
        <AuthButton user={user}/>
    </div>
  )
}

export default Header