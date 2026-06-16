'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toggleWishlist } from '@/app/actions/products'
import { addToCart } from '@/lib/cart-utils'

interface ProductCardProps {
  product: any
  isWishlisted?: boolean
}

export function ProductCard({ product, isWishlisted = false }: ProductCardProps) {
  const [liked, setLiked] = useState(isWishlisted)
  const [loading, setLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await toggleWishlist(product.id)
      if (result.success) {
        setLiked(result.added || false)
      }
    } catch (error) {
      console.error('[v0] Wishlist error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      productId: product.id,
      quantity: 1,
      price: parseFloat(product.price),
      name: product.name,
      image: product.image,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-soft)] transition hover:border-primary/30 hover:shadow-[var(--shadow-lift)]"
      >
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-slate-50">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-5 transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm font-medium text-muted-foreground">No image</span>
            </div>
          )}

          {product.featured && (
            <div className="absolute left-3 top-3 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#166534] shadow-sm">
              Featured
            </div>
          )}

          <button
            onClick={handleWishlist}
            disabled={loading}
            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-sm backdrop-blur transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`h-5 w-5 transition ${
                liked ? 'fill-destructive text-destructive' : 'text-slate-500'
              }`}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="min-h-11 text-sm font-bold leading-5 text-slate-950 line-clamp-2 transition group-hover:text-primary">
            {product.name}
          </h3>

          {product.specification && (
            <p className="mt-2 min-h-9 text-xs font-medium leading-5 text-slate-500 line-clamp-2">
              {product.specification}
            </p>
          )}

          <div className="mt-auto pt-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-950">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-bold text-[#166534]">
                Best value
              </span>
            </div>

            <div className="mb-3 flex items-center gap-2">
              {product.stock > 10 ? (
                <span className="status-badge-success">In Stock</span>
              ) : product.stock > 0 ? (
                <span className="status-badge-warning">Only {product.stock} left</span>
              ) : (
                <span className="status-badge-danger">Out of Stock</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition ${
                addedToCart
                  ? 'bg-accent text-white'
                  : product.stock === 0
                    ? 'cursor-not-allowed bg-muted text-muted-foreground'
                    : 'bg-primary text-white shadow-[0_12px_28px_rgba(37,99,235,0.22)] hover:bg-[#1D4ED8] active:scale-[0.98]'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {addedToCart ? 'Added' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
