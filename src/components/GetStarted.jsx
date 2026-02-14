"use client";
import { createClient } from '@/lib/supabase-browser';
import React from 'react'

const GetStarted = ({id}) => {

     const supabasesignin = createClient();

   // When user clicks "Sign in with Google"
  const handleSignIn = async () => {
    // Open Google's sign in page
    const { error } = await supabasesignin.auth.signInWithOAuth({
      provider: "google",
      options: {
        // After Google says OK, come back here
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("❌ Sign in failed:", error.message);
      alert("Failed to sign in. Please try again.");
    }
  };


  return (
     <div id={id} className="mt-12 p-8 bg-blue-50 rounded-lg w-full">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Sign in with <button onClick={handleSignIn} className="text-[#4296FF] cursor-pointer hover:underline font-bold">Google</button> to create your personal bookmark collection
          </p>
        </div>
  )
}

export default GetStarted