import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <ThemeProvider>
{/* <SessionProvider> */}
       <div className="min-h-screen flex flex-col">

        {/* <Navbar /> */}

        <main className="flex-grow">{children}</main>

        {/* <Footer /> */}
      </div>
      </ThemeProvider>
      {/* </SessionProvider> */}
    </>
  )
}