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
  return null
}

