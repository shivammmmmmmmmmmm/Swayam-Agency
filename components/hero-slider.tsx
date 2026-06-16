'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, Zap, Clock, Truck, Stethoscope, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    title: 'Medical Equipment',
    subtitle: 'Wholesale Supply',
    description: 'Premium hospital & diagnostic equipment at factory-direct prices. Certified, reliable, and delivered across India.',
    cta: 'Browse Equipment',
    gradient: 'from-blue-700 via-blue-600 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80',
    badge: 'Trusted Supplier',
    badgeColor: 'bg-emerald-500',
  },
  {
    id: 2,
    title: 'Diagnostic Solutions',
    subtitle: 'Lab Equipment Sale',
    description: 'Cutting-edge pathology and diagnostic instruments from the world\'s leading manufacturers. Up to 40% off on select items.',
    cta: 'Shop Diagnostics',
    gradient: 'from-slate-800 via-slate-700 to-blue-800',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&q=80',
    badge: 'Lab Grade',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 3,
    title: 'Surgical Instruments',
    subtitle: 'Premium Quality',
    description: 'Sterilized, precision-crafted surgical tools for hospitals and clinics. Bulk pricing available for institutions.',
    cta: 'View Surgical Range',
    gradient: 'from-emerald-700 via-emerald-600 to-teal-600',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&q=80',
    badge: 'Surgical Grade',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 4,
    title: 'Hospital Furniture',
    subtitle: 'Comfort & Care',
    description: 'Ergonomic hospital beds, examination tables, and patient care furniture designed for modern healthcare facilities.',
    cta: 'Explore Furniture',
    gradient: 'from-indigo-700 via-indigo-600 to-violet-600',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&q=80',
    badge: 'Hospital Grade',
    badgeColor: 'bg-indigo-600',
  },
  {
    id: 5,
    title: 'Medical Consumables',
    subtitle: 'Bulk Orders Welcome',
    description: 'High-quality disposables, PPE, and daily-use medical supplies at competitive wholesale prices with pan-India delivery.',
    cta: 'Order Supplies',
    gradient: 'from-cyan-700 via-cyan-600 to-blue-700',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80',
    badge: 'Bulk Discounts',
    badgeColor: 'bg-cyan-600',
  },
]

export function HeroSlider() {
  const [[page, direction], setPage] = useState([0, 0])
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const slideIndex = ((page % slides.length) + slides.length) % slides.length

  const paginate = useCallback((newDirection: number) => {
    setPage(([prev]) => [prev + newDirection, newDirection])
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setPage([index, index > slideIndex ? 1 : -1])
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }, [slideIndex])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => paginate(1), 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, paginate])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
  }

  const slide = slides[slideIndex]

  return (
    <section className="relative h-[600px] overflow-hidden md:h-[650px] lg:h-[700px]">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-92`} />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10">
        <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className={`mb-5 inline-flex items-center gap-2 rounded-full ${slide.badgeColor} px-4 py-2 text-sm font-bold text-white shadow-lg`}
                >
                  <Sparkles className="h-4 w-4" />
                  {slide.badge}
                </motion.div>

                <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {slide.title}
                  <span className="mt-2 block text-3xl sm:text-4xl lg:text-5xl text-blue-200">
                    {slide.subtitle}
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
                  {slide.description}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 inline-flex h-14 items-center gap-3 rounded-2xl bg-white px-8 text-base font-bold text-gray-900 shadow-2xl transition hover:bg-gray-50"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {slide.cta}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

         
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === slideIndex
                  ? 'w-8 bg-white shadow-lg'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="absolute bottom-8 right-8 z-20 hidden items-center gap-2 rounded-2xl border border-white/20 bg-black/30 px-4 py-2 text-white backdrop-blur-md md:flex">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Auto-play</span>
      </div>
    </section>
  )
}