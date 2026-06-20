'use client'

import { motion } from 'framer-motion'
import { Star, ShoppingBag, TrendingUp, Stethoscope } from 'lucide-react'
import Image from 'next/image'

const bestSellers = [
  {
    id: 1,
    name: 'Multi-Parameter Patient Monitor',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    price: 65000,
    rating: 4.9,
    reviews: 340,
    sales: 2800,
    badge: 'Most Popular',
  },
  {
    id: 2,
    name: 'Portable Ultrasound Scanner',
    image: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=400&q=80',
    price: 185000,
    rating: 4.8,
    reviews: 210,
    sales: 1500,
    badge: 'Top Rated',
  },
  {
    id: 3,
    name: 'Surgical OT Light LED',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80',
    price: 125000,
    rating: 4.7,
    reviews: 180,
    sales: 1200,
    badge: 'Premium',
  },
  {
    id: 4,
    name: 'Automatic BP Monitor',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80',
    price: 4500,
    rating: 4.6,
    reviews: 4200,
    sales: 45000,
    badge: 'Best Seller',
  },
  {
    id: 5,
    name: 'ECG Holter Recorder',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80',
    price: 28000,
    rating: 4.8,
    reviews: 560,
    sales: 3400,
    badge: 'Trending',
  },
  {
    id: 6,
    name: 'Oxygen Concentrator 10L',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400&q=80',
    price: 42000,
    rating: 4.7,
    reviews: 890,
    sales: 6700,
    badge: 'Essential',
  },
]

export function BestSellers() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/OIP (1).jpg')" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <TrendingUp className="h-4 w-4" />
              Best Selling Medical Equipment
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Most Trusted Products
            </h2>
          </div>
          <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-primary hover:text-primary">
            View All <ShoppingBag className="h-4 w-4" />
          </button>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute left-2 top-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                  {product.badge}
                </div>
                <button className="absolute right-2 top-2 flex h-8 w-8 translate-x-10 items-center justify-center rounded-full bg-white/90 shadow-sm opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                  <ShoppingBag className="h-4 w-4 text-gray-700" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</p>
                <p className="mt-1 text-sm font-black text-blue-700">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-700">{product.rating}</span>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">({product.reviews.toLocaleString('en-IN')})</span>
                </div>
                <div className="mt-2 rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                  {product.sales.toLocaleString('en-IN')} units sold
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}