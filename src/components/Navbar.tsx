'use client'
import { SignedIn, UserButton } from "@clerk/nextjs"
import { Upload, MenuIcon, Layers, Plus, User, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { ModeToggle } from "@/components/mode-toggle"

function Navbar() {
  const router = useRouter();
  return (
   <div className="h-16 bg-blue-500">Nav</div>
  )
}

export default Navbar
