'use client'

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('/api/users/checkLoggedIn')
        setLoggedIn(response.data.loggedIn)
      } catch (error: any) {
        setLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout')
    } catch (error:any) {
      console.log(error.message)      
    }
  }
  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] z-10 flex justify-between items-center px-8 bg-black/40 backdrop-blur-md shadow-lg">

      <Link href="/" className="text-3xl font-bold text-indigo-400 hover:text-indigo-300 transition">
        TaskFlow
      </Link>

      <div className="flex gap-4">
        {loggedIn && <Link
          href="/mydashboard"
          className="px-4 py-2 rounded-xl border border-gray-500 text-gray-200 hover:bg-gray-700 hover:text-white transition"
        >
          My Dashboard
        </Link>}
        {loggedIn ? (<button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-indigo-400 text-indigo-300 hover:bg-indigo-500 hover:text-white transition"
          >
            Logout
          </button>) : (
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-xl border border-indigo-400 text-indigo-300 hover:bg-indigo-500 hover:text-white transition"
          >
            Login
          </Link>
        )}
        <Link
          href="/auth/signup"
          className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
