'use server'

import { db } from '@/lib/db'
import { orders, orderItems } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createOrder(data: {
  addressId: number
  paymentMethod: string
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  shipping: number
  notes?: string
}) {
  try {
    const userId = await getUserId()
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const totalAmount = data.subtotal + data.tax + data.shipping

    const [order] = await db
      .insert(orders)
      .values({
        userId,
        orderNumber,
        addressId: data.addressId,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending',
        totalAmount,
        taxAmount: data.tax,
        shippingAmount: data.shipping,
        status: 'pending',
        notes: data.notes,
      })
      .returning()

    // Create order items
    for (const item of data.items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })
    }

    return { success: true, orderId: order.id, orderNumber: order.orderNumber }
  } catch (error) {
    console.error('[v0] Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
}

export async function getOrders() {
  try {
    const userId = await getUserId()
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))

    return { success: true, data: result }
  } catch (error) {
    console.error('[v0] Error fetching orders:', error)
    return { success: false, error: 'Failed to fetch orders', data: [] }
  }
}

export async function getOrderById(orderId: number) {
  try {
    const userId = await getUserId()
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))

    if (!order || order.userId !== userId) {
      return { success: false, error: 'Order not found' }
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))

    return { success: true, data: { order, items } }
  } catch (error) {
    console.error('[v0] Error fetching order:', error)
    return { success: false, error: 'Failed to fetch order' }
  }
}

export async function updateOrderPaymentStatus(orderId: number, paymentStatus: string) {
  try {
    const userId = await getUserId()
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId))

    if (!order || order.userId !== userId) {
      return { success: false, error: 'Order not found' }
    }

    await db
      .update(orders)
      .set({
        paymentStatus,
        status: paymentStatus === 'completed' ? 'confirmed' : 'pending',
      })
      .where(eq(orders.id, orderId))

    return { success: true }
  } catch (error) {
    console.error('[v0] Error updating order payment:', error)
    return { success: false, error: 'Failed to update order' }
  }
}
