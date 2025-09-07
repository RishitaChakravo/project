"use client"

import { Zap, ShieldCheck, Users, Smartphone } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      title: "⚡ Fast Performance",
      desc: "Optimized backend and frontend for lightning-fast load times.",
      icon: <Zap className="h-10 w-10 text-indigo-400" />,
    },
    {
      title: "🔒 Secure Authentication",
      desc: "Your data is protected with JWT, cookies, and encryption.",
      icon: <ShieldCheck className="h-10 w-10 text-green-400" />,
    },
    {
      title: "👥 Team Collaboration",
      desc: "Work together with teammates and manage tasks seamlessly.",
      icon: <Users className="h-10 w-10 text-blue-400" />,
    },
    {
      title: "📱 Mobile Friendly",
      desc: "Fully responsive design that works on all devices.",
      icon: <Smartphone className="h-10 w-10 text-pink-400" />,
    },
  ]

  return (
    <section className="py-20 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Features that make us stand out
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition"
            >
              {feature.icon}
              <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
