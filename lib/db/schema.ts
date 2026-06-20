import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// --- Better Auth required tables -------------------------------------------

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('user'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// --- App tables -------------------------------------------------------------

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  slug: text('slug').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  slugIdx: uniqueIndex('categories_slug_idx').on(table.slug),
}))

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  categoryId: integer('categoryId').notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
  image: text('image'),
  specification: text('specification'),
  slug: text('slug').notNull().unique(),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
  slugIdx: uniqueIndex('products_slug_idx').on(table.slug),
}))

export const wishlist = sqliteTable('wishlist', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull(),
  productId: integer('productId').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('wishlist_user_id_idx').on(table.userId),
  productIdIdx: index('wishlist_product_id_idx').on(table.productId),
}))

export const addresses = sqliteTable('addresses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull(),
  fullName: text('fullName').notNull(),
  phone: text('phone').notNull(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postalCode').notNull(),
  country: text('country').notNull().default('India'),
  isDefault: integer('isDefault', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('addresses_user_id_idx').on(table.userId),
}))

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull(),
  orderNumber: text('orderNumber').notNull().unique(),
  status: text('status').notNull().default('pending'),
  paymentMethod: text('paymentMethod').notNull(),
  paymentStatus: text('paymentStatus').notNull().default('pending'),
  totalAmount: real('totalAmount').notNull(),
  taxAmount: real('taxAmount').notNull().default(0),
  shippingAmount: real('shippingAmount').notNull().default(0),
  addressId: integer('addressId').notNull(),
  notes: text('notes'),
  stripeSessionId: text('stripeSessionId'),
  whatsappSent: integer('whatsappSent', { mode: 'boolean' }).notNull().default(false),
  whatsappAdminSent: integer('whatsappAdminSent', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
  orderNumberIdx: uniqueIndex('orders_order_number_idx').on(table.orderNumber),
}))

export const orderItems = sqliteTable('orderItems', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('orderId').notNull(),
  productId: integer('productId').notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
  productIdIdx: index('order_items_product_id_idx').on(table.productId),
}))

export const inventory = sqliteTable('inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('productId').notNull().unique(),
  currentStock: integer('currentStock').notNull().default(0),
  lowStockThreshold: integer('lowStockThreshold').notNull().default(10),
  reorderQuantity: integer('reorderQuantity').notNull().default(50),
  lastRestockDate: integer('lastRestockDate', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  productIdIdx: index('inventory_product_id_idx').on(table.productId),
}))
