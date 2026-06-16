'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, ShoppingBag, Stethoscope } from 'lucide-react'
import { HeroSlider } from './hero-slider'
import { CategoryShowcase } from './category-showcase'
import { TrustSection } from './trust-section'
import { FlashSale } from './flash-sale'
import { BestSellers } from './best-sellers'
import { OrderOnWhatsApp } from './testimonials'
import { WhatsAppFloat } from './whatsapp-float'
import { ProductCard } from './product-card'
import { getCategories, getProducts, getWishlistItems } from '@/app/actions/products'

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="aspect-square animate-pulse bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-8 w-full animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function HomePage() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [wishlistItems, setWishlistItems] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [categoriesRes, productsRes, wishlistRes] = await Promise.all([
          getCategories(),
          getProducts(selectedCategory, searchQuery, currentPage),
          getWishlistItems(),
        ])
        if (categoriesRes.success) setCategories(categoriesRes.data || [])
        if (productsRes.success) {
          setProducts(productsRes.data || [])
          setPagination(productsRes.pagination)
        }
        if (wishlistRes.success) setWishlistItems(wishlistRes.data || [])
      } catch (error) {
        console.error('[v0] Error loading catalog:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedCategory, searchQuery, currentPage])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  // Featured section with categories as tabs
  const featuredCategories = [
    { id: null, name: 'All Products' },
    ...categories,
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <Stethoscope className="h-4 w-4" />
              Medical Equipment Catalog
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Our Product Range
            </h2>
            <p className="mt-3 text-lg font-medium text-gray-500">
              Premium medical equipment for hospitals, clinics, and diagnostic labs
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {featuredCategories.slice(0, 8).map((cat) => (
              <motion.button
                key={cat.id ?? 'all'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(cat.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white text-gray-600 shadow-sm hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search medical equipment..."
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm font-medium shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <LoadingSkeleton />
          ) : products.length === 0 ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-lg font-semibold text-gray-600">
                No medical equipment found. Try adjusting your search.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistItems.includes(product.id)}
                  />
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-10 flex items-center justify-center gap-2"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
                          currentPage === pageNum
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* Flash Sale */}
      <FlashSale />

      {/* Best Sellers */}
      <BestSellers />

      {/* WhatsApp Order Section */}
      <OrderOnWhatsApp />

      {/* Floating WhatsApp Button */}
      <WhatsAppFloat />
    </div>
  )
}