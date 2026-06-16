'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle, Stethoscope, ShieldCheck, Bell } from 'lucide-react'

const benefits = [
  { icon: ShieldCheck, text: 'Exclusive medical equipment deals' },
  { icon: Bell, text: 'New product & certification updates' },
  { icon: Stethoscope, text: 'Healthcare industry insights' },
]

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 py-16 md:py-24">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-400 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-cyan-400 blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-16"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-xl">
            <Mail className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Stay Updated with Medical Supplies
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-gray-400">
            Get the latest updates on medical equipment arrivals, exclusive bulk discounts, and healthcare industry news delivered to your inbox.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your business email"
                    required
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 pl-12 pr-4 text-sm font-medium text-white placeholder-gray-500 backdrop-blur-sm transition focus:border-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="inline-flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 px-6 text-sm font-bold text-white shadow-xl transition hover:shadow-2xl"
                >
                  <Send className="h-4 w-4" />
                  Subscribe
                </motion.button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-green-500/10 px-6 py-4 text-green-400"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="font-bold">Thank you! You'll receive our medical equipment updates.</span>
            </motion.div>
          )}

          {/* Benefits */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-400"
              >
                <benefit.icon className="h-4 w-4 text-blue-400" />
                {benefit.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}