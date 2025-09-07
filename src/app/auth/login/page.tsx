"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async () => {
        try {
            const response = await axios.post('/api/users/login', {
                email,
                password
            })

            console.log("Login success:", response.data)
            router.push('/')
            
        } catch (error) {
            console.error("Login failed:", error)
        } 
    }

    return (
        <div className="flex flex-col space-y-2 justify-center items-center w-screen h-screen bg-gradient-to-b from-indigo-950 to-black">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 w-[400px] p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-indigo-300 mb-6 tracking-wide">
                    Login
                </h2>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <label className="text-sm mb-1 text-gray-200">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="p-3 rounded-lg border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm mb-1 text-gray-200">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="p-3 rounded-lg border border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        onClick={submit}
                        className="mt-4 w-full py-3 rounded-xl bg-indigo-500 text-white text-lg font-semibold hover:bg-indigo-600 transition shadow-md">
                        Login
                    </button>
                </div>
            </div>
            <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                <a
                    href="/auth/signup"
                    className="text-indigo-400 hover:text-indigo-300 hover:underline transition"
                >
                    Sign up
                </a>
            </p>

        </div>
    );
}
