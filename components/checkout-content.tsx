'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCart, getCartSummary, clearCart } from '@/lib/cart-utils'
import { getAddresses } from '@/app/actions/addresses'
import { createOrder } from '@/app/actions/orders'
import { authClient } from '@/lib/auth-client'

const steps = ['address', 'payment', 'review'] as const

export function CheckoutContent() {
  const router = useRouter()
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address')
  const [cart, setCart] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('cod')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: sessionData } = await authClient.getSession()
        setSession(sessionData)

        if (!sessionData?.user) {
          router.push('/sign-in')
          return
        }

        const cartData = getCart()
        if (cartData.items.length === 0) {
          router.push('/cart')
          return
        }

        setCart(cartData)
        setSummary(getCartSummary(cartData))

        const addressesResult = await getAddresses()
        if (addressesResult.success) {
          setAddresses(addressesResult.data)
          const defaultAddr = addressesResult.data.find((a: any) => a.isDefault)
          setSelectedAddress(defaultAddr || addressesResult.data[0])
        }
      } catch (error) {
        console.error('[v0] Error loading checkout:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address')
      return
    }

    setSubmitting(true)
    try {
      const orderResult = await createOrder({
        addressId: selectedAddress.id,
        paymentMethod,
        items: cart.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: summary.subtotal,
        tax: summary.tax,
        shipping: summary.shipping,
        notes,
      })

      if (orderResult.success) {
        clearCart()
        router.push(`/order-confirmation/${orderResult.orderId}`)
      } else {
        alert('Error placing order: ' + orderResult.error)
      }
    } catch (error) {
      console.error('[v0] Error placing order:', error)
      alert('Error placing order')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-sm font-semibold text-slate-500">Loading...</div>
  }

  if (!cart || !session) {
    return null
  }

  const stepIndex = steps.indexOf(step)

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Secure checkout</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Checkout</h1>
      </div>

      <div className="mb-10 flex flex-wrap gap-4">
        {steps.map((s, idx) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold shadow-sm ${
                step === s
                  ? 'bg-primary text-white'
                  : idx < stepIndex
                    ? 'bg-accent text-white'
                    : 'bg-white text-slate-500 border border-border'
              }`}
            >
              {idx + 1}
            </div>
            <span className="text-sm font-bold capitalize text-slate-700">{s}</span>
            {idx < 2 && <ChevronRight className="h-5 w-5 text-slate-300" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 'address' && (
            <div className="enterprise-card p-6 sm:p-8">
              <h2 className="mb-6 text-2xl font-extrabold text-slate-950">Delivery Address</h2>

              {addresses.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-8 text-center">
                  <p className="mb-4 text-sm font-semibold text-slate-500">No addresses saved. Add one now.</p>
                  <Link href="/account/addresses" className="primary-button">
                    Manage Addresses
                  </Link>
                </div>
              ) : (
                <div className="mb-8 space-y-4">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => setSelectedAddress(address)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedAddress?.id === address.id
                          ? 'border-primary bg-primary/5 shadow-[0_12px_30px_rgba(37,99,235,0.10)]'
                          : 'border-border bg-white hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input type="radio" checked={selectedAddress?.id === address.id} onChange={() => setSelectedAddress(address)} className="mt-1 accent-primary" />
                        <div>
                          <h3 className="font-extrabold text-slate-950">{address.fullName}</h3>
                          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                            {address.street}
                            <br />
                            {address.city}, {address.state} {address.postalCode}
                            <br />
                            Phone: {address.phone}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/cart" className="secondary-button flex-1">
                  Back to Cart
                </Link>
                <button onClick={() => setStep('payment')} disabled={!selectedAddress} className="primary-button flex-1">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="enterprise-card p-6 sm:p-8">
              <h2 className="mb-6 text-2xl font-extrabold text-slate-950">Payment Method</h2>

              <div className="mb-8 space-y-4">
                {[
                  ['cod', 'Cash on Delivery', 'Pay when you receive your order'],
                  ['stripe', 'Credit/Debit Card', 'Pay securely with Stripe'],
                ].map(([method, title, text]) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method as 'cod' | 'stripe')}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      paymentMethod === method
                        ? 'border-primary bg-primary/5 shadow-[0_12px_30px_rgba(37,99,235,0.10)]'
                        : 'border-border bg-white hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method as 'cod' | 'stripe')} className="accent-primary" />
                      <div>
                        <h3 className="font-extrabold text-slate-950">{title}</h3>
                        <p className="text-sm font-medium text-slate-500">{text}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label className="mb-2 block text-sm font-bold text-slate-700">Order Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for delivery?"
                  className="min-h-28 w-full rounded-xl border border-input bg-white px-4 py-3 text-sm font-medium shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setStep('address')} className="secondary-button flex-1">
                  Back
                </button>
                <button onClick={() => setStep('review')} className="primary-button flex-1">
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="enterprise-card p-6 sm:p-8">
              <h2 className="mb-6 text-2xl font-extrabold text-slate-950">Order Review</h2>

              <div className="mb-8 space-y-6">
                <section className="border-b border-border pb-6">
                  <h3 className="mb-3 font-extrabold text-slate-950">Delivery Address</h3>
                  <p className="text-sm font-medium leading-6 text-slate-500">
                    {selectedAddress.fullName}
                    <br />
                    {selectedAddress.street}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                    <br />
                    {selectedAddress.country} | Phone: {selectedAddress.phone}
                  </p>
                </section>
                <section className="border-b border-border pb-6">
                  <h3 className="mb-3 font-extrabold text-slate-950">Payment Method</h3>
                  <p className="text-sm font-medium text-slate-500">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card via Stripe'}</p>
                </section>
                <section className="border-b border-border pb-6">
                  <h3 className="mb-3 font-extrabold text-slate-950">Order Items</h3>
                  <div className="space-y-3">
                    {cart.items.map((item: any) => (
                      <div key={item.productId} className="flex justify-between gap-4 text-sm font-semibold">
                        <span className="text-slate-600">{item.name} x {item.quantity}</span>
                        <span className="text-slate-950">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setStep('payment')} className="secondary-button flex-1">
                  Back
                </button>
                <button onClick={handlePlaceOrder} disabled={submitting} className="primary-button flex-1 bg-accent hover:bg-emerald-600">
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {summary && (
          <div>
            <div className="enterprise-card sticky top-24 p-6">
              <h3 className="mb-5 text-lg font-extrabold text-slate-950">Order Summary</h3>

              <div className="mb-4 space-y-3 border-b border-border pb-4">
                {cart.items.map((item: any) => (
                  <div key={item.productId} className="flex justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-500">{item.name} x{item.quantity}</span>
                    <span className="font-bold text-slate-950">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 space-y-2 border-b border-border pb-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Subtotal</span>
                  <span className="font-bold">₹{summary.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Tax (5%)</span>
                  <span className="font-bold">₹{summary.tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Shipping</span>
                  <span className="font-bold">{summary.shipping === 0 ? 'FREE' : `₹${summary.shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-extrabold">
                <span>Total</span>
                <span className="text-primary">₹{summary.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
