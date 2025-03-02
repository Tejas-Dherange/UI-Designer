"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Layers, LogOut, Plus, Settings, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { SignedIn, UserButton } from "@clerk/nextjs"

export function DashboardHeader() {
  const pathname = usePathname()
  // const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 p-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 font-bold">
          <Layers className="h-5 w-5" />
          <span>UI Designer</span>
        </div>
        <div className="flex items-center gap-4 ml-6">
          <Link 
            href="/dashboard" 
            className={`text-sm ${pathname === "/dashboard" ? "font-medium" : "text-muted-foreground"}`}
          >
            Projects
          </Link>
          <Link 
            href="/dashboard/components" 
            className={`text-sm ${pathname === "/dashboard/components" ? "font-medium" : "text-muted-foreground"}`}/>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Link href="/dashboard/new-project">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
            <ModeToggle />
           <SignedIn>
            <UserButton  />
           </SignedIn>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader