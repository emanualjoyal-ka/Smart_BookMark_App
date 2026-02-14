// // components/BookmarkList.js
// // THE DISPLAY CASE - Shows all bookmarks and updates instantly

// 'use client'

// import { createClient } from '@/lib/supabase-browser'
// import { useState, useEffect } from 'react'

// export default function BookmarkList({ userId }) {
// //   State
//   const [bookmarks, setBookmarks] = useState([])  // List of bookmarks
//   const [loading, setLoading] = useState(true)    // Are we loading?
//   const supabase = createClient()

//   // useEffect = "Do this when component starts"
//   useEffect(() => {
//     // 1. Load existing bookmarks
//     loadBookmarks()

//     // 2. SETUP REALTIME - THIS IS THE MAGIC!
//     // Think of this as opening a direct phone line to Supabase
//     const subscription = supabase
//       .channel('bookmarks-realtime')  // Give this channel a name
//       .on(
//         'postgres_changes',  // Listen for database changes
//         {
//           event: '*',        // Listen for INSERT, UPDATE, DELETE
//           schema: 'public',  // Our database schema
//           table: 'bookmarks',// Which table to watch
//           filter: `user_id=eq.${userId}`  // Only my bookmarks
//         },
//         // This function runs IMMEDIATELY when something changes
//         (payload) => {
//           console.log('📨 Realtime update:', payload)
          
//           if (payload.eventType === 'INSERT') {
//             // Add new bookmark to the list
//             setBookmarks(current => [payload.new, ...current])
//           }
          
//           if (payload.eventType === 'DELETE') {
//             // Remove deleted bookmark
//             setBookmarks(current => 
//               current.filter(b => b.id !== payload.old.id)
//             )
//           }
//         }
//       )
//       .subscribe()  // Pick up the phone and start listening

//     // Cleanup: Hang up when component is destroyed
//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [userId]) // Re-run if userId changes

//   // Load all bookmarks from database
//   const loadBookmarks = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('bookmarks')
//         .select('*')
//         .eq('user_id', userId)
//         .order('created_at', { ascending: false })  // Newest first

//       if (error) throw error
//       setBookmarks(data || [])
//     } catch (error) {
//       console.error('Error loading bookmarks:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Delete a bookmark
//   const handleDelete = async (id, title) => {
//     // Ask for confirmation
//     if (!confirm(`Delete "${title}"?`)) return

//     try {
//       const { error } = await supabase
//         .from('bookmarks')
//         .delete()
//         .eq('id', id)

//       if (error) throw error
//       // No need to update state - realtime will do it!
      
//     } catch (error) {
//       console.error('Error deleting bookmark:', error)
//       alert('Failed to delete bookmark')
//     }
//   }

//   // Show loading spinner
//   if (loading) {
//     return (
//       <div className="text-center py-12">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
//         <p className="mt-2 text-gray-600">Loading your bookmarks...</p>
//       </div>
//     )
//   }

//   // Show empty state
//   if (bookmarks.length === 0) {
//     return (
//       <div className="text-center py-12 bg-gray-50 rounded-lg">
//         <div className="text-6xl mb-4">📚</div>
//         <p className="text-lg text-gray-600">No bookmarks yet</p>
//         <p className="text-sm text-gray-500 mt-2">
//           Add your first bookmark using the form above
//         </p>
//       </div>
//     )
//   }

//   // Show bookmarks
//   return (
//     <div className="space-y-3">
//       {bookmarks.map((bookmark) => (
//         <div
//           key={bookmark.id}
//           className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
//         >
//           {/* Bookmark Info */}
//           <div className="flex-1 min-w-0">
//             <a
//               href={bookmark.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:underline font-medium flex items-center gap-1"
//             >
//               {bookmark.title}
//               <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//               </svg>
//             </a>
//             <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
//             <p className="text-xs text-gray-400 mt-1">
//               Added: {new Date(bookmark.created_at).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric'
//               })}
//             </p>
//           </div>
          
//           {/* Delete Button */}
//           <button
//             onClick={() => handleDelete(bookmark.id, bookmark.title)}
//             className="ml-4 p-2 text-gray-400 hover:text-red-500 cursor-pointer transition opacity-0 group-hover:opacity-100"
//             title="Delete bookmark"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//           </button>
//         </div>
//       ))}
//     </div>
//   )
// }
// components/BookmarkList.js
// FIXED VERSION - With better error handling and reconnection logic

'use client'

import { createClient } from '@/lib/supabase-browser'
import { useState, useEffect, useRef } from 'react'

export default function BookmarkList({ userId }) {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const supabase = createClient()
  
  // Use a ref to track if we've already set up the subscription
  const subscriptionRef = useRef(null)

  // Load bookmarks function
  const loadBookmarks = async () => {
    try {
      console.log('📚 Loading bookmarks for user:', userId)
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      console.log('✅ Loaded bookmarks:', data)
      setBookmarks(data || [])
    } catch (error) {
      console.error('❌ Error loading bookmarks:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load initial bookmarks
    loadBookmarks()

    // IMPORTANT: Check if Supabase realtime is available
    console.log('🔌 Setting up realtime connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    // Set up realtime subscription
    const setupRealtime = () => {
      // Create a unique channel name
      const channel = supabase
        .channel(`bookmarks-${userId}-${Date.now()}`) // Unique channel name
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log('📨 Realtime update received:', payload)
            
            // Handle different event types
            if (payload.eventType === 'INSERT') {
              setBookmarks(current => {
                // Check if bookmark already exists (prevent duplicates)
                if (current.some(b => b.id === payload.new.id)) {
                  return current
                }
                return [payload.new, ...current]
              })
            }
            
            if (payload.eventType === 'DELETE') {
              setBookmarks(current => 
                current.filter(b => b.id !== payload.old.id)
              )
            }
            
            if (payload.eventType === 'UPDATE') {
              setBookmarks(current =>
                current.map(b => b.id === payload.new.id ? payload.new : b)
              )
            }
          }
        )

      // Subscribe with error handling
      const subscription = channel.subscribe((status) => {
        console.log('📡 Realtime subscription status:', status)
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime!')
        }
        
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime channel error')
          setError('Realtime connection failed. Refresh to try again.')
        }
        
        if (status === 'TIMED_OUT') {
          console.error('⏰ Realtime subscription timed out')
          // Try to reconnect
          setTimeout(() => {
            subscription.unsubscribe()
            setupRealtime()
          }, 5000)
        }
      })

      return subscription
    }

    // Set up the subscription
    const subscription = setupRealtime()
    subscriptionRef.current = subscription

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up realtime subscription')
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [userId]) // Only re-run if userId changes

  // Delete a bookmark
  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return

    try {
      console.log('🗑️ Deleting bookmark:', id)
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (error) throw error
      console.log('✅ Delete successful')
      
    } catch (error) {
      console.error('❌ Error deleting bookmark:', error)
      alert('Failed to delete bookmark')
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading your bookmarks...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={loadBookmarks}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Show empty state
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-lg text-gray-600">No bookmarks yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Add your first bookmark using the form above
        </p>
      </div>
    )
  }

  // Show bookmarks
  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          <div className="flex-1 min-w-0">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              {bookmark.title}
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
            <p className="text-xs text-gray-400 mt-1">
              Added: {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <button
            onClick={() => handleDelete(bookmark.id, bookmark.title)}
            className="ml-4 p-2 text-gray-400 hover:text-red-500 cursor-pointer transition opacity-0 group-hover:opacity-100"
            title="Delete bookmark"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}