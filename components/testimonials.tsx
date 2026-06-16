'use client'

import { motion } from 'framer-motion'
import { MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const WHATSAPP_NUMBER = '919890509712'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Swayam%20Agency!%20I%20want%20to%20place%20an%20order%20for%20medical%20equipment.`

const orderSteps = [
  {
    icon: ShoppingBag,
    title: 'Select Your Products',
    description: 'Browse our catalog and choose the medical equipment you need',
  },
  {
    icon: MessageCircle,
    title: 'Chat on WhatsApp',
    description: 'Share your requirements and get a customized quote instantly',
  },
  {
    icon: ArrowRight,
    title: 'Place Your Order',
    description: 'Confirm details and we\'ll process your shipment within 24 hours',
  },
]

export function OrderOnWhatsApp() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 py-16 md:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
          {/* Left - CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl text-center lg:text-left"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
              <MessageCircle className="h-4 w-4" />
              Quick & Easy Ordering
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Want to Place an Order?
            </h2>
            <p className="mt-4 text-lg font-medium leading-relaxed text-white/85">
              Skip the hassle. Send us a message on WhatsApp and our team will help you select the right equipment, provide pricing, and arrange pan-India delivery.
            </p>

            <motion.a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-flex h-16 items-center gap-3 rounded-2xl bg-white px-8 text-lg font-bold text-green-700 shadow-2xl transition hover:bg-gray-50 hover:shadow-3xl"
            >
              <MessageCircle className="h-7 w-7" />
              Chat on WhatsApp
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-600">
                +91 98905 09712
              </span>
            </motion.a>

            <p className="mt-4 text-sm font-medium text-white/60">
              Response time: Usually within 5 minutes during business hours
            </p>
          </motion.div>

          {/* Right - Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md space-y-4"
          >
            {orderSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm font-medium text-white/70">{step.description}</p>
                </div>
              </motion.div>
            ))}

            <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-center backdrop-blur-md">
              <p className="text-sm font-bold text-green-300">
                🎉 Get 5% discount on your first order via WhatsApp!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}