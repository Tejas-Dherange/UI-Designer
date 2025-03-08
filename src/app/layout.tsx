import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "CircleU",
  description: "Circle U is a social media platform for students.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen h-screen flex flex-col ">
          {/* <SessionProvider> */}
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
            {children}
          {/* </ThemeProvider> */}
          {/* </SessionProvider> */}
          <Toaster />

        </body>
      </html>
    </ClerkProvider>
  );
}
