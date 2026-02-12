import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart book App",
  description: "Save and manage your favourite websites",
};

export default async function RootLayout({ children }) {

  const supabase=createClient();
  const response = await supabase.auth.getUser()
  const user = response?.data?.user

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
         <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo - Click to go home */}
            <a href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              🔖 Smart Bookmarks
            </a>
            {/* Auth button shows sign in/out */}
            {/* <AuthButton user={user} /> */}
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

         <footer className="bg-white border-t mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600">
            <p>© 2024 Smart Bookmarks - Save your favorite websites</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
