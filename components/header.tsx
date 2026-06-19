'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Heart, ShoppingCart, LogOut, LogIn, Menu, X, Search, UserRound, Phone, MessageCircle, Stethoscope, ShoppingBag, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_LINK = 'https://wa.me/919890509712?text=Hi%20Swayam%20Agency!%20I%20want%20to%20inquire%20about%20medical%20equipment.'

export function Header() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)

    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession()
        setSession(data)
        // Check if user is admin
        if (data?.user) {
          try {
            const adminRes = await fetch('/api/admin/check')
            const adminData = await adminRes.json()
            setIsAdmin(adminData.isAdmin)
          } catch {
            setIsAdmin(false)
          }
        }
      } catch (error) {
        setSession(null)
      } finally {
        setLoading(false)
      }
    }
    checkSession()

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }
    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      setSession(null)
      router.push('/')
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          <div className="flex items-center gap-4 text-xs font-medium text-blue-200">
            <span className="flex items-center gap-1">
              <Stethoscope className="h-3 w-3" />
              Medical Equipment Supplier - ISO 13485 Certified
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a href={`tel:+919890509712`} className="flex items-center gap-1 text-blue-200 transition hover:text-white">
              <Phone className="h-3 w-3" />
              +91 98905 09712
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-300 transition hover:text-green-200"
            >
              <MessageCircle className="h-3 w-3" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-gray-100 bg-white shadow-lg'
            : 'bg-white/95 backdrop-blur-md'
        }`}
      >
        <div className="px-4 py-2.5">
          <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-3 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/swayam-logo.png"
                  alt="Swayam Agency"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-base font-black tracking-tight text-gray-900">
                  Swayam
                  <span className="text-blue-600"> Agency</span>
                </div>
                <div className="text-[11px] font-semibold text-gray-500 tracking-wide">
                  MEDICAL EQUIPMENT SUPPLIER
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden items-center justify-center gap-1 lg:flex">
              {[
                { name: 'Home', href: '/', active: true },
                { name: 'Products', href: '/products', active: false },
                { name: 'Categories', href: '#categories', active: false },
                { name: 'Best Sellers', href: '#best-sellers', active: false },
                { name: 'Contact', href: '#contact', active: false },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
                >
                  {item.name}
                  {item.active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-blue-50"
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-4/5" />
                </Link>
              ))}

              {/* WhatsApp Order CTA in Nav */}
              <motion.a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-3 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:shadow-green-500/40"
              >
                <MessageCircle className="h-4 w-4" />
                Order Now
              </motion.a>
            </nav>

            {/* Actions */}
            <div className="flex min-w-0 items-center gap-2">
              {/* Search - Desktop */}
              <div className="relative hidden w-full max-w-[200px] xl:block">
                <input
                  type="text"
                  placeholder="Search equipment..."
                  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-10 text-sm font-medium text-gray-900 placeholder-gray-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Wishlist */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/wishlist"
                  className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  title="Wishlist"
                >
                  <Heart className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-1.5 text-[10px] font-bold text-white shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* Auth */}
              {!loading && (
                <>
                  {session?.user ? (
                    <div className="relative group">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                          {session.user.name?.[0]?.toUpperCase()}
                        </div>
                      </motion.button>
                      <div className="invisible group-hover:visible absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 text-gray-900 shadow-2xl opacity-0 transition-all group-hover:opacity-100 z-50" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
                        <div className="border-b border-gray-100 px-4 py-3">
                          <p className="text-sm font-bold">{session.user.name}</p>
                          <p className="text-xs font-medium text-gray-500">{session.user.email}</p>
                        </div>
                        <Link href="/account/addresses" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600">
                          <UserRound className="h-4 w-4" />
                          My Addresses
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600">
                          <ShoppingBag className="h-4 w-4" />
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-purple-700 transition hover:bg-purple-50 hover:text-purple-600">
                            <Shield className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link href="/sign-in">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </motion.button>
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-gray-100 bg-white lg:hidden"
            >
              <div className="px-4 py-3">
                <div className="relative mb-3">
                  <input type="text" placeholder="Search medical equipment..." className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm font-medium transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100" />
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>

                <nav className="flex flex-col gap-1">
                  {['Home', 'Products', 'Categories', 'Best Sellers', 'Contact'].map((item) => (
                    <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600">
                      {item}
                    </Link>
                  ))}

                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg">
                    <MessageCircle className="h-5 w-5" />
                    Order on WhatsApp
                    <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs">+91 98905 09712</span>
                  </a>

                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                      <a href="tel:+919890509712" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Call Us
                      </a>
                      <span className="text-gray-300">|</span>
                      <span>ISO 13485 Certified</span>
                    </div>
                  </div>

                  {!session?.user && (
                    <Link href="/sign-in" className="mt-3">
                      <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-lg">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </div>
                    </Link>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}

