"use client";

import axios from "axios";
import { useState } from "react";
import {useRouter} from "next/navigation"

export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const response = await axios.post("/api/users/signup", {
        name,
        username,
        email,
        password,
      });

      console.log("Signup success:", response.data);
      router.push('/auth/login')
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-2 justify-center items-center w-screen h-screen bg-gradient-to-b from-indigo-950 to-black">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 w-[400px] p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-indigo-300 mb-8 tracking-wide drop-shadow">
          Create Account
        </h2>

        <div className="flex flex-col gap-6">

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-200">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="p-3 rounded-lg border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-200">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="p-3 rounded-lg border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 rounded-lg border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="p-3 rounded-lg border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <button
            onClick={submit}
            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Sign Up
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-sm">
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="text-indigo-400 hover:text-indigo-300 hover:underline transition"
        >
          Log in
        </a>
      </p>
    </div>
  );
}
