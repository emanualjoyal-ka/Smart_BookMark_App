import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
// import { createClient } from "@/lib/supabase-browser";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
  // ✅ cookies must be awaited
  const cookieStore = await cookies();

  // ✅ pass URL, KEY, and cookie handlers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <Header user={user} />
        {children}
        <LoadingScreen/>
      </body>
    </html>
  );
}
