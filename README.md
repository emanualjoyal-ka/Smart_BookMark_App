# Smart Bookmark App

> A modern, real-time bookmark manager that allows users to securely save and manage their favorite web links. The app features Google OAuth authentication for seamless sign-in, ensuring that each user's bookmarks remain private and inaccessible to others. Users can add bookmarks with URLs and titles, view their collection in real-time across multiple browser tabs, and delete bookmarks when no longer needed. Built with Next.js and Supabase, the application leverages real-time database subscriptions for instant updates and is deployed on Vercel for reliable production access.

**Technologies used** : 
Nextjs, OAuth, Supabase, GSAP

## 🚧 Challenges Faced & Solutions

Throughout the development of this project, I encountered several technical challenges. Here's a detailed breakdown of each problem and how I resolved them.

### 1. Supabase.js createServerClient() Migration

**The Problem:**
Initially, I implemented the Supabase client using the older approach where cookie handling was done differently. The previous method only required `getAll()` and `setAll()` functions, but the updated `createServerClient()` function requires explicit `get()`, `set()`, and `remove()` methods for cookie management.

**The Solution:**
I refactored the Supabase client implementation to properly handle cookies using the new API structure:

```
// Before (Old way)
const supabase = createServerClient(
  supabaseUrl,
  supabaseKey,
  {
    cookies: {
      getAll() { /* ... */ },
      setAll() { /* ... */ }
    }
  }
);

// After (New way)
const supabase = createServerClient(
  supabaseUrl,
  supabaseKey,
  {
    cookies: {
      get(name) { /* Get specific cookie */ },
      set(name, value, options) { /* Set specific cookie */ },
      remove(name, options) { /* Remove specific cookie */ }
    }
  }
);
```
### 2. Supabase Project Setup

**The Problem**
Setting up Supabase from scratch required careful attention to multiple configuration steps. The initial setup lacked proper organization of environment variables and project settings.

**The Solution**
Implemented a structured setup process:

Project Creation:

Created new project in Supabase Dashboard

Noted the project URL and anon key

Configured database region closest to target users

Environment Configuration:

env
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
Database Schema Setup:

Created necessary tables using SQL editor

Set up Row Level Security (RLS) policies

Configured database triggers for realtime functionality

Key Learning: Proper initial configuration prevents numerous downstream issues. Documenting each setup step helps maintain consistency across development environments.

### 3. Middleware File Renaming

**The Problem**
The default middleware.js filename in Next.js caused conflicts with authentication routing:

File was being automatically executed for all routes

Authentication checks were interfering with static asset loading

Created unexpected redirect loops

**The Solution**
Renamed middleware.js to proxy.js and updated the implementation:

```
// proxy.js - Custom authentication proxy
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res
}
```
Key Learning: Understanding Next.js file conventions is crucial. The middleware name has special meaning in Next.js, and using custom names gives more control over execution timing and routing logic.

### 4. OAuth Redirect URL Configuration

**The Problem**
After deploying to Vercel, Google OAuth authentication was failing because:

The redirect URL was still pointing to localhost:3000

Users were being redirected to localhost after successful authentication

Production environment couldn't complete the OAuth flow

**The Solution**
Updated the Supabase URL configuration to include the production URL:

In Supabase Dashboard:

text
Authentication → URL Configuration → Site URL
Before: http://localhost:3000
After: https://your-vercel-app.vercel.app
Added additional redirect URLs:

text
https://your-vercel-app.vercel.app/**
http://localhost:3000/** (for development)
Updated environment variables in Vercel:

Set production environment variables in Vercel dashboard

Ensured all OAuth credentials were updated

Key Learning: OAuth configurations must be environment-aware. Always maintain separate redirect URLs for development and production environments.

### 5. Realtime Features in Production

**The Problem**
Realtime database subscriptions worked perfectly in development but failed in production:

Changes weren't reflecting in real-time

WebSocket connections weren't establishing properly

No console errors to indicate the issue

**The Solution**
Diagnosed and fixed multiple issues:

Enabled Realtime on Tables:

sql
-- Enable realtime for specific tables
alter publication supabase_realtime add table your_table_name;
Configured Subscription Properly:

```
// Proper realtime subscription setup
const subscription = supabase
  .channel('table-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'your_table_name'
    },
    (payload) => {
      console.log('Change received!', payload)
      // Update UI accordingly
    }
  )
  .subscribe()
```
Production-specific Considerations:

Verified WebSocket support in production environment

Added reconnection logic for dropped connections

Implemented proper cleanup of subscriptions

Key Learning: Realtime features require explicit configuration in production. Always verify that:

Tables are added to the realtime publication

WebSocket connections are allowed in your hosting environment

Subscriptions are properly managed (created and cleaned up)