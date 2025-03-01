'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'

function Footer() {
  const router=useRouter();
  return (
    

<footer className="bg-gradient-to-br from-blue-700 to-blue-300 text-white py-4   w-full">
      <div className="container flex gap-5 justify-center mx-auto text-center">
        <div className="mt-4 flex gap-5 justify-center">
        <button title="About " className="text-white hover:text-gray-300 mx-3" onClick={() => router.push("/dashboard/About")}>About Us</button>
        <button title="About " className="text-white hover:text-gray-300 mx-3" onClick={() => router.push("/dashboard/Services")}>Services</button>
        <button title="About " className="text-white hover:text-gray-300 mx-3" onClick={() => router.push("/dashboard/contact-us")}>Contact Us</button>

          <a href="#" className="hover:text-gray-300 mx-3">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 mx-3">Terms & Conditions</a>
        </div>
      </div>
    </footer>
   
  )
}

export default Footer
