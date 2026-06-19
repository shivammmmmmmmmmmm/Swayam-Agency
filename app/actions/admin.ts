'use server'

import { getDb } from '@/lib/db'
import { getAuthInstance } from '@/lib/auth'
import { products, categories, orders, orderItems, user } from '@/lib/db/schema'
import { eq, desc, asc, and, like, count, sum } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { isDummyAdminEmail } from '@/lib/admin'

/**
 * Get the current user's ID and verify they are an admin.
 * Throws if not authenticated or not admin.
 */
async function requireAdmin() {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  
  const db = getDb()
  const [dbUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (!dbUser || (dbUser.role !== 'admin' && !isDummyAdminEmail(dbUser.email))) {
    throw new Error('Forbidden: Admin access required')
  }
  return dbUser
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export async function getAdminDashboardStats() {
  try {
    await requireAdmin()
    const db = getDb()

    const [productStats] = await db.select({ count: count() }).from(products)
    const [orderStats] = await db.select({ count: count() }).from(orders)
    const [pendingOrderStats] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, 'pending'))
    const [userStats] = await db.select({ count: count() }).from(user)
    const [revenueStats] = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.status, 'confirmed'))

    const totalProducts = Number(productStats?.count ?? 0)
    const totalOrders = Number(orderStats?.count ?? 0)
    const pendingOrders = Number(pendingOrderStats?.count ?? 0)
    const totalUsers = Number(userStats?.count ?? 0)
    const totalRevenue = Number(revenueStats?.total ?? 0)

    return {
      success: true,
      data: { totalProducts, totalOrders, pendingOrders, totalUsers, totalRevenue }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── Products Management ────────────────────────────────────────────────────

export async function adminGetProducts(search?: string, page = 1) {
  try {
    await requireAdmin()
    const db = getDb()
    const pageSize = 20
    const offset = (page - 1) * pageSize

    const result = await (search
      ? db.select().from(products).where(like(products.name, `%${search}%`))
      : db.select().from(products)
    ).orderBy(desc(products.createdAt)).limit(pageSize).offset(offset)
    const total = (await db.select({ count: products.id }).from(products))[0]?.count || 0

    return {
      success: true,
      data: result,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    }
  } catch (error: any) {
    return { success: false, error: error.message, data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } }
  }
}

export async function adminCreateProduct(data: {
  name: string
  description?: string
  categoryId: number
  price: number
  stock: number
  image?: string
  specification?: string
  slug: string
  featured?: boolean
}) {
  try {
    await requireAdmin()
    const db = getDb()

    await db.insert(products).values({
      name: data.name,
      description: data.description || '',
      categoryId: data.categoryId,
      price: data.price,
      stock: data.stock,
      image: data.image || '',
      specification: data.specification || '',
      slug: data.slug,
      featured: data.featured || false,
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function adminUpdateProduct(id: number, data: {
  name?: string
  description?: string
  categoryId?: number
  price?: number
  stock?: number
  image?: string
  specification?: string
  slug?: string
  featured?: boolean
}) {
  try {
    await requireAdmin()
    const db = getDb()

    await db.update(products).set(data).where(eq(products.id, id))
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function adminDeleteProduct(id: number) {
  try {
    await requireAdmin()
    const db = getDb()

    await db.delete(products).where(eq(products.id, id))
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── Categories Management ──────────────────────────────────────────────────

export async function adminGetCategories() {
  try {
    await requireAdmin()
    const db = getDb()
    const result = await db.select().from(categories).orderBy(asc(categories.name))
    return { success: true, data: result }
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function adminCreateCategory(data: {
  name: string
  description?: string
  image?: string
  slug: string
}) {
  try {
    await requireAdmin()
    const db = getDb()

    await db.insert(categories).values({
      name: data.name,
      description: data.description || '',
      image: data.image || '',
      slug: data.slug,
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function adminDeleteCategory(id: number) {
  try {
    await requireAdmin()
    const db = getDb()

    await db.delete(categories).where(eq(categories.id, id))
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── Orders Management ──────────────────────────────────────────────────────

export async function adminGetOrders(status?: string, page = 1) {
  try {
    await requireAdmin()
    const db = getDb()
    const pageSize = 20
    const offset = (page - 1) * pageSize

    const result = await (status && status !== 'all'
      ? db.select().from(orders).where(eq(orders.status, status))
      : db.select().from(orders)
    ).orderBy(desc(orders.createdAt)).limit(pageSize).offset(offset)
    const total = (await db.select({ count: orders.id }).from(orders))[0]?.count || 0

    return {
      success: true,
      data: result,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    }
  } catch (error: any) {
    return { success: false, error: error.message, data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } }
  }
}

export async function adminGetOrderDetails(orderId: number) {
  try {
    await requireAdmin()
    const db = getDb()

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
    if (!order) return { success: false, error: 'Order not found' }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))

    const [orderUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, order.userId))
      .limit(1)

    return { success: true, data: { order, items, user: orderUser } }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function adminUpdateOrderStatus(orderId: number, status: string) {
  try {
    await requireAdmin()
    const db = getDb()

    await db.update(orders).set({ status }).where(eq(orders.id, orderId))
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function adminUpdatePaymentStatus(orderId: number, paymentStatus: string) {
  try {
    await requireAdmin()
    const db = getDb()

    await db.update(orders).set({ paymentStatus }).where(eq(orders.id, orderId))
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
