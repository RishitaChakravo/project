'use client'

import NavBar from "./components/NavBar";
import { TaskHero } from "./components/heroSec";

export default function Home() {
    return(<>
        <NavBar/>
        <TaskHero/>
        <footer className="bg-gray-800 text-gray-400 py-6 mt-20">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
    <p className="text-sm font-semibold">TaskFlow &copy; {new Date().getFullYear()}</p>
    <div className="flex gap-6 mt-2 md:mt-0">
      <a href="#" className="hover:text-white transition">About</a>
      <a href="#" className="hover:text-white transition">Contact</a>
      <a href="#" className="hover:text-white transition">Docs</a>
    </div>
  </div>
</footer>

    </>);
}