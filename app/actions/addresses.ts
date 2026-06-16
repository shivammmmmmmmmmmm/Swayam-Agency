'use server'

import { db } from '@/lib/db'
import { addresses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getAddresses() {
  try {
    const userId = await getUserId()
    const result = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(addresses.id)

    return { success: true, data: result }
  } catch (error) {
    console.error('[v0] Error fetching addresses:', error)
    return { success: false, error: 'Failed to fetch addresses', data: [] }
  }
}

export async function getAddressById(id: number) {
  try {
    const userId = await getUserId()
    const result = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .limit(1)

    return { success: true, data: result[0] || null }
  } catch (error) {
    console.error('[v0] Error fetching address:', error)
    return { success: false, error: 'Failed to fetch address' }
  }
}

export async function createAddress(data: {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country?: string
  isDefault?: boolean
}) {
  try {
    const userId = await getUserId()

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId))
    }

    const result = await db
      .insert(addresses)
      .values({
        ...data,
        userId,
        country: data.country || 'India',
        isDefault: data.isDefault || false,
      })
      .returning()

    revalidatePath('/account/addresses')
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('[v0] Error creating address:', error)
    return { success: false, error: 'Failed to create address' }
  }
}

export async function updateAddress(
  id: number,
  data: {
    fullName?: string
    phone?: string
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    isDefault?: boolean
  }
) {
  try {
    const userId = await getUserId()

    // Verify address belongs to user
    const existing = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .limit(1)

    if (!existing.length) {
      return { success: false, error: 'Address not found' }
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId))
    }

    const result = await db
      .update(addresses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(addresses.id, id))
      .returning()

    revalidatePath('/account/addresses')
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('[v0] Error updating address:', error)
    return { success: false, error: 'Failed to update address' }
  }
}

export async function deleteAddress(id: number) {
  try {
    const userId = await getUserId()

    // Verify address belongs to user
    const existing = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .limit(1)

    if (!existing.length) {
      return { success: false, error: 'Address not found' }
    }

    await db.delete(addresses).where(eq(addresses.id, id))

    revalidatePath('/account/addresses')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting address:', error)
    return { success: false, error: 'Failed to delete address' }
  }
}

export async function getDefaultAddress() {
  try {
    const userId = await getUserId()
    const result = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)))
      .limit(1)

    return { success: true, data: result[0] || null }
  } catch (error) {
    console.error('[v0] Error fetching default address:', error)
    return { success: false, error: 'Failed to fetch default address' }
  }
}
