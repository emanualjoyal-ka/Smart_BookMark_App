import { createBrowserClient} from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
     {
      // IMPORTANT: Add realtime configuration
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      // This ensures the WebSocket connects properly
      db: {
        schema: 'public',
      },
    }
  )
}