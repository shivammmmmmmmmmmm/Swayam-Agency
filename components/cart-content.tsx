'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trash2, ArrowRight, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCart, removeFromCart, updateQuantity, getCartSummary } from '@/lib/cart-utils'
import { authClient } from '@/lib/auth-client'

export function CartContent() {
  const router = useRouter()
  const [cart, setCart] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = getCart()
        setCart(cartData)
        setSummary(getCartSummary(cartData))

        const { data: sessionData } = await authClient.getSession()
        setSession(sessionData)
      } catch (error) {
        console.error('[v0] Error loading cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const handleRemove = (productId: number) => {
    const updatedCart = removeFromCart(productId)
    setCart(updatedCart)
    setSummary(getCartSummary(updatedCart))
  }

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedCart = updateQuantity(productId, newQuantity)
    setCart(updatedCart)
    setSummary(getCartSummary(updatedCart))
  }

  const handleCheckout = () => {
    if (!session?.user) {
      router.push('/sign-in?redirect=/checkout')
    } else {
      router.push('/checkout')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-sm font-semibold text-slate-500">Loading...</div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="enterprise-card mx-auto max-w-xl p-10 text-center">
          <ShoppingCart className="mx-auto mb-5 h-16 w-16 text-slate-300" />
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-950">Your cart is empty</h1>
          <p className="mb-7 text-sm font-medium text-slate-500">Add medical instruments to begin your order.</p>
          <Link href="/" className="primary-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Checkout</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="enterprise-card overflow-hidden">
            {cart.items.map((item: any, index: number) => (
              <div
                key={item.productId}
                className={`grid grid-cols-[96px_1fr_auto] gap-5 p-5 sm:grid-cols-[120px_1fr_auto] sm:p-6 ${index > 0 ? 'border-t border-border' : ''}`}
              >
                <div className="overflow-hidden rounded-2xl bg-slate-50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="h-24 w-24 object-contain p-2 sm:h-28 sm:w-28"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center text-xs font-medium text-slate-400 sm:h-28 sm:w-28">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="mb-2 text-base font-extrabold text-slate-950">{item.name}</h3>
                  <p className="mb-4 text-sm font-semibold text-slate-500">₹{Number(item.price).toLocaleString('en-IN')}</p>

                  <div className="flex w-fit items-center overflow-hidden rounded-xl border border-input bg-white shadow-sm">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="h-10 px-3 text-slate-600 transition hover:bg-muted"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, parseInt(e.target.value))
                      }
                      className="h-10 w-12 border-x border-border text-center text-sm font-bold focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="h-10 px-3 text-slate-600 transition hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <p className="text-lg font-extrabold text-slate-950">
                    ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="flex size-10 items-center justify-center rounded-xl text-destructive transition hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link href="/" className="mt-6 inline-flex text-sm font-bold text-primary transition hover:text-[#1D4ED8]">
            Continue Shopping
          </Link>
        </div>

        {summary && (
          <div>
            <div className="enterprise-card sticky top-24 p-6">
              <h2 className="mb-6 text-xl font-extrabold text-slate-950">Order Summary</h2>

              <div className="mb-6 space-y-4 border-b border-border pb-6 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Subtotal</span>
                  <span className="font-bold text-slate-950">₹{summary.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Tax (5%)</span>
                  <span className="font-bold text-slate-950">₹{summary.tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Shipping</span>
                  <span className="font-bold text-slate-950">
                    {summary.shipping === 0 ? <span className="text-accent">FREE</span> : `₹${summary.shipping}`}
                  </span>
                </div>
              </div>

              <div className="mb-6 flex justify-between">
                <span className="text-lg font-extrabold">Total</span>
                <span className="text-2xl font-extrabold text-primary">
                  ₹{summary.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <button onClick={handleCheckout} className="primary-button w-full">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              {summary.shipping > 0 && (
                <p className="mt-4 text-center text-sm font-medium text-slate-500">
                  Free shipping on orders over ₹50,000
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
