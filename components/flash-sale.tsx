'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Zap, ShoppingBag, Heart, Stethoscope } from 'lucide-react'
import Image from 'next/image'

const saleProducts = [
  {
    id: 1,
    name: 'Digital X-Ray Machine 500mA',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=400&q=80',
    price: 249000,
    originalPrice: 399000,
    discount: 38,
  },
  {
    id: 2,
    name: 'Patient Monitor 5-Parameter',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    price: 45000,
    originalPrice: 72000,
    discount: 37,
  },
  {
    id: 3,
    name: 'Autoclave Sterilizer 25L',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80',
    price: 35000,
    originalPrice: 55000,
    discount: 36,
  },
  {
    id: 4,
    name: 'ECG Machine 12-Channel',
    image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=400&q=80',
    price: 52000,
    originalPrice: 85000,
    discount: 39,
  },
]

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculate = () => {
      const diff = targetDate.getTime() - new Date().getTime()
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      return { hours, minutes, seconds }
    }

    setTimeLeft(calculate())
    const interval = setInterval(() => {
      setTimeLeft(calculate())
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex items-center gap-3">
      {[
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="flex h-12 w-14 items-center justify-center rounded-xl bg-white/15 text-2xl font-black text-white backdrop-blur-sm">
            {String(item.value).padStart(2, '0')}
          </div>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export function FlashSale() {
  const targetDate = new Date()
  targetDate.setHours(targetDate.getHours() + 47)
  targetDate.setMinutes(targetDate.getMinutes() + 30)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-700 py-16 md:py-24">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-300 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Left - Header + Timer */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-md"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              Medical Flash Sale - Limited Stock
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Equipment Deals
            </h2>
            <p className="mt-4 text-lg font-medium text-white/80">
              Premium medical equipment at unbeatable wholesale prices. Stock up for your facility today!
            </p>

            <div className="mt-8">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white/70">
                <Clock className="h-4 w-4" />
                Sale ends in:
              </div>
              <CountdownTimer targetDate={targetDate} />
            </div>
          </motion.div>

          {/* Right - Products Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4"
          >
            {saleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute left-2 top-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    -{product.discount}%
                  </div>
                  <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow-sm opacity-0 transition group-hover:opacity-100">
                    <Heart className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-3 transition group-hover:translate-y-0">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2 text-xs font-bold text-gray-900 shadow-lg">
                      <ShoppingBag className="h-3 w-3" /> Quick Order
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-black text-blue-700">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-medium text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}