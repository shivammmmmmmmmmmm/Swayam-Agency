export interface CartItem {
  productId: number
  quantity: number
  price: number
  name: string
  image?: string
}

export interface Cart {
  items: CartItem[]
  updatedAt: number
}

const CART_STORAGE_KEY = 'swayam_cart'

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], updatedAt: Date.now() }
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) {
      return { items: [], updatedAt: Date.now() }
    }
    return JSON.parse(stored)
  } catch {
    return { items: [], updatedAt: Date.now() }
  }
}

export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('[v0] Error saving cart:', error)
  }
}

export function addToCart(item: CartItem): Cart {
  const cart = getCart()
  const existingIndex = cart.items.findIndex((i) => i.productId === item.productId)

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += item.quantity
  } else {
    cart.items.push(item)
  }

  cart.updatedAt = Date.now()
  saveCart(cart)
  return cart
}

export function removeFromCart(productId: number): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((i) => i.productId !== productId)
  cart.updatedAt = Date.now()
  saveCart(cart)
  return cart
}

export function updateQuantity(productId: number, quantity: number): Cart {
  const cart = getCart()
  const item = cart.items.find((i) => i.productId === productId)

  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId)
    } else {
      item.quantity = quantity
    }
  }

  cart.updatedAt = Date.now()
  saveCart(cart)
  return cart
}

export function clearCart(): Cart {
  const cart: Cart = { items: [], updatedAt: Date.now() }
  saveCart(cart)
  return cart
}

export function getCartSummary(cart: Cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05 // 5% tax
  const shipping = subtotal > 50000 ? 0 : 500 // Free shipping over ₹50,000
  const total = subtotal + tax + shipping

  return {
    itemCount: cart.items.length,
    subtotal,
    tax,
    shipping,
    total,
  }
}
