import { pgTable, text, timestamp, boolean, serial, integer, decimal, varchar, index } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables for Swayam Agency E-Commerce --------------------------------

// Categories for medical instruments
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  image: text('image'),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
}))

// Products - medical instruments
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  categoryId: integer('categoryId').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  image: text('image'),
  specification: text('specification'),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
  slugIdx: index('products_slug_idx').on(table.slug),
}))

// Wishlist
export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  productId: integer('productId').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('wishlist_user_id_idx').on(table.userId),
  productIdIdx: index('wishlist_product_id_idx').on(table.productId),
}))

// Addresses
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  fullName: varchar('fullName', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  street: text('street').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  postalCode: varchar('postalCode', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull().default('India'),
  isDefault: boolean('isDefault').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('addresses_user_id_idx').on(table.userId),
}))

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  orderNumber: varchar('orderNumber', { length: 50 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paymentMethod: varchar('paymentMethod', { length: 50 }).notNull(), // 'stripe' or 'cod'
  paymentStatus: varchar('paymentStatus', { length: 50 }).notNull().default('pending'),
  totalAmount: decimal('totalAmount', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('taxAmount', { precision: 10, scale: 2 }).notNull().default('0'),
  shippingAmount: decimal('shippingAmount', { precision: 10, scale: 2 }).notNull().default('0'),
  addressId: integer('addressId').notNull(),
  notes: text('notes'),
  stripeSessionId: varchar('stripeSessionId', { length: 255 }),
  whatsappSent: boolean('whatsappSent').notNull().default(false),
  whatsappAdminSent: boolean('whatsappAdminSent').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
  orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
}))

// Order Items
export const orderItems = pgTable('orderItems', {
  id: serial('id').primaryKey(),
  orderId: integer('orderId').notNull(),
  productId: integer('productId').notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
  productIdIdx: index('order_items_product_id_idx').on(table.productId),
}))

// Inventory tracking for stock alerts
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  productId: integer('productId').notNull().unique(),
  currentStock: integer('currentStock').notNull().default(0),
  lowStockThreshold: integer('lowStockThreshold').notNull().default(10),
  reorderQuantity: integer('reorderQuantity').notNull().default(50),
  lastRestockDate: timestamp('lastRestockDate'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  productIdIdx: index('inventory_product_id_idx').on(table.productId),
}))
