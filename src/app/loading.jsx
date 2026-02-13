import React from 'react'

const loading = () => {
  return (
    <div className='bg-white min-h-screen flex items-center justify-center'>
       <div className="flex flex-col items-center gap-2">
        <div className="h-25 w-25 border-8 border-t-transparent border-orange-500 animate-spin rounded-full"></div>
        <p className="text-orange-500 text-xl font-semibold">Loading...</p>
      </div>
    </div>
  )
}

export default loading