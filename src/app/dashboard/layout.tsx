import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"
import { SessionProvider } from "next-auth/react";

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
{/* <SessionProvider> */}
       <div className="min-h-screen flex flex-col">

        <Navbar />

        <main className="flex-grow">{children}</main>

        {/* <Footer /> */}
      </div>
 
      {/* </SessionProvider> */}
    </>
  )
}