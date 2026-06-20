'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCategories, getProducts, getWishlistItems } from '@/app/actions/products'
import { ProductCard } from './product-card'

export function ProductCatalog() {
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

        if (categoriesRes.success) {
          setCategories(categoriesRes.data ?? [])
        }
        if (productsRes.success) {
          setProducts(productsRes.data ?? [])
          setPagination(productsRes.pagination)
        }
        if (wishlistRes.success) {
          setWishlistItems(wishlistRes.data ?? [])
        }
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

  return (
    <div className="min-h-screen bg-sky-50">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2563EB,#4F46E5)] text-white">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:auto,auto,48px_48px,48px_48px]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              Premium medical commerce for hospitals and labs
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Enterprise-grade instruments, sourced with confidence.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-blue-50 sm:text-lg">
              Shop certified hospital, pathology, and diagnostic equipment from Swayam Agency with fast support, verified supply, and business-ready service.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#products" className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-primary shadow-xl transition hover:bg-slate-50">
                Shop Products
              </a>
              <a href="tel:+919890509712" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/40 px-6 text-sm font-bold text-white transition hover:bg-white/10">
                Talk to Sales
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative hidden min-h-72 lg:block"
          >
            <div className="absolute right-4 top-0 w-80 rounded-3xl border border-white/20 bg-white/95 p-5 text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.24)] backdrop-blur">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="h-36 rounded-xl bg-[linear-gradient(135deg,#F8FAFC,#E0E7FF)]" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold">Featured Diagnostics Kit</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Ready for dispatch</p>
                </div>
                <span className="status-badge-success">In Stock</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-6 rounded-2xl border border-white/20 bg-white/15 p-4 text-white shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8" />
                <div>
                  <p className="text-sm font-bold">Certified Supply</p>
                  <p className="text-xs text-blue-50">ISO compliant products</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border bg-sky-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-5 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: ShieldCheck, title: 'Verified suppliers', text: 'Business-grade procurement support' },
            { icon: Truck, title: 'Fast delivery', text: 'Same-day options where available' },
            { icon: Sparkles, title: 'Premium support', text: 'Guidance before and after purchase' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <item.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-slate-950">{item.title}</p>
                <p className="text-xs font-medium text-slate-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div id="products" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-sky-50">
        <div className="flex gap-6">
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="enterprise-card sticky top-24 p-4">
              <h2 className="mb-4 text-base font-extrabold text-slate-950">Categories</h2>

              <button
                onClick={() => handleCategoryChange(null)}
                className={`mb-1 block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  selectedCategory === null
                    ? 'bg-primary text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)]'
                    : 'text-slate-600 hover:bg-muted hover:text-slate-950'
                }`}
              >
                All Products
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`mb-1 block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)]'
                      : 'text-slate-600 hover:bg-muted hover:text-slate-950'
                  }`}
                >
                  {category.name}
                </button>
              ))}

              <div className="mt-6 border-t border-border pt-6">
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Buying Options</h3>
                <div className="space-y-3 text-xs font-medium text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-accent" />
                    Same day delivery available
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                    Certified medical suppliers
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                  {selectedCategory !== null
                    ? categories.find((c) => c.id === selectedCategory)?.name
                    : 'All Products'}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Showing {products.length} curated product{products.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="relative w-full sm:max-w-sm">
                <input
                  value={searchQuery}
                  onChange={(event) => handleSearch(event.target.value)}
                  placeholder="Search catalog..."
                  className="enterprise-input w-full pr-11"
                />
                <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-200/70" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="enterprise-card p-12 text-center">
                <p className="text-lg font-semibold text-slate-600">
                  No products found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlistItems.includes(product.id)}
                    />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2 pb-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex size-10 items-center justify-center rounded-xl border border-border bg-white text-slate-700 shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
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
                              ? 'bg-primary text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)]'
                              : 'border border-border bg-white text-slate-700 hover:bg-muted'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="flex size-10 items-center justify-center rounded-xl border border-border bg-white text-slate-700 shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
