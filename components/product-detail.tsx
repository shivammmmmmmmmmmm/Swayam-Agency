'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, ShoppingCart, ArrowLeft, ShieldCheck, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { toggleWishlist } from '@/app/actions/products'
import { addToCart } from '@/lib/cart-utils'

interface ProductDetailProps {
  product: any
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleWishlist = async () => {
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

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity,
      price: parseFloat(product.price),
      name: product.name,
      image: product.image,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-[#1D4ED8]">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="enterprise-card overflow-hidden bg-slate-50 p-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-400">
                No image available
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {product.featured && (
            <div className="mb-4 w-fit rounded-full bg-[#DCFCE7] px-4 py-1.5 text-sm font-bold text-[#166534]">
              Featured Product
            </div>
          )}

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">{product.name}</h1>

          {product.specification && (
            <p className="mt-4 text-lg font-medium leading-8 text-slate-600">{product.specification}</p>
          )}

          <div className="my-7">
            <span className="text-5xl font-extrabold tracking-tight text-primary">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {product.stock > 0 ? (
                <>
                  <span className="status-badge-success">In Stock</span>
                  {product.stock < 20 && (
                    <span className="status-badge-warning">Only {product.stock} available</span>
                  )}
                </>
              ) : (
                <span className="status-badge-danger">Out of Stock</span>
              )}
            </div>
          </div>

          {product.description && (
            <div className="mb-8 rounded-2xl border border-border bg-white p-5">
              <h3 className="mb-3 text-lg font-extrabold text-slate-950">Description</h3>
              <p className="leading-7 text-slate-600">{product.description}</p>
            </div>
          )}

          {product.stock > 0 && (
            <div className="mb-8">
              <label className="mb-3 block text-sm font-bold text-slate-700">Quantity</label>
              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-input bg-white shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-12 px-4 text-slate-600 transition hover:bg-muted">
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value))))}
                  className="h-12 w-16 border-x border-border text-center text-sm font-bold focus:outline-none"
                />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="h-12 px-4 text-slate-600 transition hover:bg-muted">
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || loading}
              className={`primary-button flex-1 ${addedToCart ? 'bg-accent hover:bg-emerald-600' : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {addedToCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <button onClick={handleWishlist} disabled={loading} className="secondary-button">
              <Heart className={`h-5 w-5 ${liked ? 'fill-destructive text-destructive' : 'text-primary'}`} />
              {liked ? 'Liked' : 'Save'}
            </button>
          </div>

          <div className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-bold text-slate-950">Certified Product</p>
              <p className="text-xs font-medium text-slate-500">Sourced for healthcare buyers</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <Truck className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-bold text-slate-950">Availability</p>
              <p className="text-xs font-medium text-slate-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
