'use server'

import { db } from '@/lib/db'
import { products, categories, wishlist } from '@/lib/db/schema'
import { eq, ilike, and, desc, asc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id
}

export async function getCategories() {
  try {
    const result = await db.select().from(categories).orderBy(asc(categories.name))
    return { success: true, data: result }
  } catch (error) {
    console.error('[v0] Error fetching categories:', error)
    return { success: false, error: 'Failed to fetch categories' }
  }
}

export async function getProducts(
  categoryId?: number | null,
  searchQuery?: string,
  page: number = 1
) {
  try {
    const pageSize = 12
    const offset = (page - 1) * pageSize

    let query = db.select().from(products)

    const conditions = []
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId))
    }
    if (searchQuery) {
      conditions.push(ilike(products.name, `%${searchQuery}%`))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const result = await query
      .orderBy(desc(products.featured), desc(products.createdAt))
      .limit(pageSize)
      .offset(offset)

    const totalCountResult = await db
      .select({ count: products.id })
      .from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const totalCount = totalCountResult[0]?.count || 0

    return {
      success: true,
      data: result,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    }
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
    return {
      success: false,
      error: 'Failed to fetch products',
      data: [],
      pagination: { page: 1, pageSize: 12, totalCount: 0, totalPages: 0 },
    }
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
    return { success: true, data: result[0] || null }
  } catch (error) {
    console.error('[v0] Error fetching product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}

export async function toggleWishlist(productId: number) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: false, error: 'Not authenticated' }
    }

    const existing = await db
      .select()
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))
      .limit(1)

    if (existing.length > 0) {
      await db
        .delete(wishlist)
        .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))
      return { success: true, added: false }
    } else {
      await db.insert(wishlist).values({ userId, productId })
      return { success: true, added: true }
    }
  } catch (error) {
    console.error('[v0] Error toggling wishlist:', error)
    return { success: false, error: 'Failed to update wishlist' }
  }
}

export async function getWishlistItems() {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: true, data: [] }
    }

    const wishlistItems = await db
      .select({ productId: wishlist.productId })
      .from(wishlist)
      .where(eq(wishlist.userId, userId))

    return { success: true, data: wishlistItems.map((item) => item.productId) }
  } catch (error) {
    console.error('[v0] Error fetching wishlist:', error)
    return { success: false, error: 'Failed to fetch wishlist', data: [] }
  }
}

export async function getWishlistProducts() {
  try {
    const userId = await getUserId()
    if (!userId) {
      return { success: true, data: [] }
    }

    const result = await db
      .select({ product: products })
      .from(wishlist)
      .innerJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, userId))
      .orderBy(desc(wishlist.createdAt))

    return { success: true, data: result.map((item) => item.product) }
  } catch (error) {
    console.error('[v0] Error fetching wishlist products:', error)
    return { success: false, error: 'Failed to fetch wishlist products', data: [] }
  }
}
