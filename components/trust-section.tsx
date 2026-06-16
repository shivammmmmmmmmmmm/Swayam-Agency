'use client'

import { motion } from 'framer-motion'
import { Truck, ShieldCheck, Stethoscope, Syringe, ClipboardCheck } from 'lucide-react'

const trustItems = [
  {
    icon: Truck,
    title: 'Pan-India Delivery',
    description: 'Free shipping on orders over ₹25,000',
    gradient: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'ISO Certified Products',
    description: '100% quality assured medical equipment',
    gradient: 'from-emerald-500 to-green-500',
    bgLight: 'bg-emerald-50',
  },
  {
    icon: Syringe,
    title: 'Sterilization Guarantee',
    description: 'All surgical tools sterilized & sealed',
    gradient: 'from-purple-500 to-indigo-500',
    bgLight: 'bg-purple-50',
  },
  {
    icon: ClipboardCheck,
    title: 'GST & Bulk Invoicing',
    description: 'Business-ready documentation for institutions',
    gradient: 'from-rose-500 to-pink-500',
    bgLight: 'bg-rose-50',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
      {/* Medical background overlay */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <Stethoscope className="h-4 w-4" />
            Why Healthcare Partners Trust Us
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Built for Medical Excellence
          </h2>
          <p className="mt-3 text-lg font-medium text-gray-500">
            Your trusted partner for medical equipment supply across India
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trustItems.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group rounded-2xl border border-gray-100 bg-white/90 p-6 text-center shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
            >
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${item.bgLight} transition group-hover:scale-110`}
              >
                <div className={`rounded-xl bg-gradient-to-br ${item.gradient} p-3 text-white shadow-lg`}>
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm font-medium text-gray-500">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}