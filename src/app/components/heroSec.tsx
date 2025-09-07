"use client";

import axios from "axios";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function TaskHero() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await axios.get('/api/users/checkLoggedIn')
                setLoggedIn(response.data.loggedIn)
            } catch (err) {
                setLoggedIn(false)
            } finally {
                setLoading(false)
            }
        }

        checkLoggedIn()
    }, [])
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gray-50 dark:bg-gray-900">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-200">
                {"Organize Your Work Effortlessly".split(" ").map((word, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="mr-2 inline-block"
                    >
                        {word}
                    </motion.span>
                ))}
            </h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 max-w-2xl text-gray-600 dark:text-gray-400 text-lg"
            >
                Create tasks, assign them to your team, and track progress — all in one place.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="mt-8 flex flex-wrap justify-center gap-4"
            >
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Create a Task
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white transition">
                    View Teams
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="mt-8 flex justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        y: [0, -5, 0],
                        boxShadow: [
                            "0 5px 15px rgba(59, 130, 246, 0.3)",
                            "0 10px 20px rgba(59, 130, 246, 0.5)",
                            "0 5px 15px rgba(59, 130, 246, 0.3)",
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                    }}
                    className="px-10 py-4 font-bold text-white rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2"
                >
                    Get Started
                </motion.button>
            </motion.div>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9 }}
                className="mt-12 flex flex-wrap justify-center gap-4"
            >
                {["Create Teams", "Track Projects", "Complete solo tasks"].map((task, i) => (
                    <div
                        key={i}
                        className="w-40 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition"
                    >
                        <p className="font-semibold text-gray-700 dark:text-gray-200">{task}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
