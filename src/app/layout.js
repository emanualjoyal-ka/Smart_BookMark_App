import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { createClient } from "@/lib/supabase-browser";

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
  const supabase = createClient();
  const response = await supabase.auth.getUser();
  const user = response?.data?.user;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
       {/* <div className="flex flex-col h-screen"> */}
        <Header user={user}/>
        
        {children}
        {/* <Footer/> */}
       {/* </div> */}
        <LoadingScreen/>
      </body>
    </html>
  );
}
