"use client";
import { createClient } from "@/lib/supabase-browser";

const AuthButton = ({ user }) => {
    
  const supabase = createClient();

  // When user clicks "Sign in with Google"
  const handleSignIn = async () => {
    // Open Google's sign in page
    const { error } = await supabase.auth.signInWithOAuth({
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

  // When user clicks "Sign Out"
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Refresh the page to update UI
    window.location.reload();
  };

  // If user is logged in, show sign out button
  if (user) {
    return (
      <div className="flex items-center gap-4">
        {/* Show user's email with small avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600 hidden md:block">
            {user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
        >
          <p className="font-bold">Sign Out</p>
        </button>
      </div>
    );
  }

  // If not logged in, show sign in button
  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 bg-[#4296FF] text-white rounded-lg hover:bg-blue-600 transition-hover duration-200 cursor-pointer"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
        />
      </svg>
      <p className="font-bold">Sign in</p>
    </button>
  );
}

export default AuthButton;
