'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Stethoscope, Microscope, Syringe, Pill, Bed, HeartPulse } from 'lucide-react'
import Image from 'next/image'

const categories = [
  {
    name: 'Diagnostic Equipment',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&q=80',
    count: '850+ Products',
    icon: Microscope,
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    name: 'Surgical Instruments',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&q=80',
    count: '1,200+ Products',
    icon: Syringe,
    gradient: 'from-emerald-600 to-teal-500',
  },
  {
    name: 'Hospital Furniture',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80',
    count: '600+ Products',
    icon: Bed,
    gradient: 'from-indigo-600 to-violet-500',
  },
  {
    name: 'Medical Consumables',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80',
    count: '2,500+ Products',
    icon: Pill,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    name: 'Cardiology Equipment',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    count: '400+ Products',
    icon: HeartPulse,
    gradient: 'from-red-500 to-rose-500',
  },
  {
    name: 'General Medical',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
    count: '1,800+ Products',
    icon: Stethoscope,
    gradient: 'from-slate-700 to-slate-500',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
  },
}

export function CategoryShowcase() {
  return (
    <section id="categories" className="relative overflow-hidden bg-sky-50 py-16 md:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{ backgroundImage: "url('/3e140ba14ab9cbf050fddc83f4075c87.jpg')" }}
        aria-hidden="true"
      />
      {/* Medical background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/80 via-sky-50/60 to-sky-50/80" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <Stethoscope className="h-4 w-4" />
            Medical Categories
          </div>
          <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Browse by Department
          </h2>
          <p className="mt-4 text-lg font-medium text-gray-500">
            Complete medical equipment solutions for hospitals, clinics, and laboratories
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {categories.map((category) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className={`rounded-2xl bg-gradient-to-r ${category.gradient} p-3 shadow-lg`}>
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className={`mb-2 inline-flex rounded-full bg-gradient-to-r ${category.gradient} p-2`}>
                  <category.icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
                <p className="text-sm font-medium text-white/70">{category.count}</p>
              </div>

              {/* Explore button on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="translate-y-4 transform transition duration-500 group-hover:translate-y-0">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-xl">
                    Explore <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}