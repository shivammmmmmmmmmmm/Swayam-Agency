'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getWishlistProducts } from '@/app/actions/products'
import { authClient } from '@/lib/auth-client'
import { ProductCard } from './product-card'
import { Heart } from 'lucide-react'

export function WishlistContent() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: sessionData } = await authClient.getSession()
        setSession(sessionData)

        if (!sessionData?.user) {
          setLoading(false)
          return
        }

        const result = await getWishlistProducts()
        if (result.success) {
          setProducts(result.data)
        }
      } catch (error) {
        console.error('[v0] Error loading wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-sm font-semibold text-slate-500">Loading...</div>
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="enterprise-card mx-auto max-w-xl p-10 text-center">
          <Heart className="mx-auto mb-5 h-16 w-16 text-slate-300" />
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-950">Sign in to view your wishlist</h1>
          <p className="mb-7 text-sm font-medium text-slate-500">
            Please sign in to save and manage your favorite products.
          </p>
          <Link href="/sign-in" className="primary-button">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Saved products</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">My Wishlist</h1>
      </div>

      {products.length === 0 ? (
        <div className="enterprise-card mx-auto max-w-xl p-10 text-center">
          <Heart className="mx-auto mb-5 h-16 w-16 text-slate-300" />
          <p className="mb-7 text-lg font-semibold text-slate-600">Your wishlist is empty</p>
          <Link href="/" className="primary-button">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm font-medium text-slate-500">
            You have {products.length} item{products.length !== 1 ? 's' : ''} in your wishlist
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} isWishlisted={true} />
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
