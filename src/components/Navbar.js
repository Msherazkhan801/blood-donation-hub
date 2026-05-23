'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FiMenu, FiX } from 'react-icons/fi'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="font-sans">
      <nav className="flex items-center justify-between px-8 py-4 shadow-md bg-white relative">
        <Link href="/" > <div className="flex items-center justify-center space-x-2">
          <img src="/assets/images/logo.png" alt="logo" className="h-12 w-12" />
          <span className="text-xl font-bold text-red-600">
            Blood  <span className="text-black">Donation Hub</span>
          </span>
        </div>
        </Link>
        <ul className="hidden md:flex space-x-8 text-gray-800 font-medium">
          <li className="text-red-600">
               <Link href="/" >Home</Link></li>
          <li>
            <Link href="/find-donor" className="text-black hover:text-red-600">Find Donors</Link>
          </li>
          <li>
          </li>
        </ul>
        <Link
          href="/donate-blood"
          className="hidden md:block bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Donate Blood
        </Link>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <FiX className="text-2xl text-gray-700" />
            ) : (
              <FiMenu className="text-2xl text-gray-700" />
            )}
          </button>
        </div>
        {isOpen && (
          <div className="absolute top-20 left-0 w-full bg-white shadow-md md:hidden z-10">
            <ul className="flex flex-col items-start px-6 py-4 space-y-4 text-gray-800 font-medium">
              <li className="text-red-600">Home</li>
              <li>
                <Link href="/find-donor" onClick={() => setIsOpen(false)}>Find Donors</Link>
              </li>
              <li>
              </li>
              <li>
                <Link
                  href="/donate-blood"
                  onClick={() => setIsOpen(false)}
                  className="w-full block bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 transition"
                >
                 Donate Blood
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  )
}
