'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function OrderConfirmation() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="enterprise-card p-8 text-center sm:p-10">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-accent" />
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-slate-950">Order Confirmed</h1>
        <p className="mb-8 text-lg font-medium text-slate-500">
          Thank you for your order. We&apos;ve sent confirmation details to your email.
        </p>

        <div className="mb-8 rounded-2xl bg-slate-50 p-6 text-left">
          <h2 className="mb-4 text-lg font-extrabold text-slate-950">What happens next?</h2>
          <ol className="space-y-3 text-sm font-medium text-slate-600">
            {[
              "You'll receive a WhatsApp confirmation with order details",
              'Our team will prepare and dispatch your order within 2-3 business days',
              "You'll receive tracking information via WhatsApp and email",
              'Track your order status in your account dashboard',
            ].map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="font-extrabold text-primary">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-3">
          <Link href="/orders" className="primary-button w-full">
            View Your Orders
          </Link>
          <Link href="/" className="secondary-button w-full">
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-sm font-medium text-slate-500">
          For any questions, contact us at{' '}
          <a href="tel:+919890509712" className="font-bold text-primary hover:underline">
            +91 9890509712
          </a>{' '}
          or{' '}
          <a href="mailto:swayam.agency1870@gmail.com" className="font-bold text-primary hover:underline">
            swayam.agency1870@gmail.com
          </a>
        </p>
      </div>
    </motion.div>
  )
}
