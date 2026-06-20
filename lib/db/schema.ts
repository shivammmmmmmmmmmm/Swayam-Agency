import {
  pgTable,
  text,
  integer,
  serial,
  boolean,
  timestamp,
  real,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('user'),
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

// --- App tables -------------------------------------------------------------

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  image: text('image'),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('categories_slug_idx').on(table.slug),
}))

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  categoryId: integer('categoryId').notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
  image: text('image'),
  specification: text('specification'),
  slug: text('slug').notNull().unique(),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
  slugIdx: uniqueIndex('products_slug_idx').on(table.slug),
}))

export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  productId: integer('productId').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('wishlist_user_id_idx').on(table.userId),
  productIdIdx: index('wishlist_product_id_idx').on(table.productId),
}))

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  fullName: text('fullName').notNull(),
  phone: text('phone').notNull(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postalCode').notNull(),
  country: text('country').notNull().default('India'),
  isDefault: boolean('isDefault').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('addresses_user_id_idx').on(table.userId),
}))

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
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
  whatsappSent: boolean('whatsappSent').notNull().default(false),
  whatsappAdminSent: boolean('whatsappAdminSent').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
  orderNumberIdx: uniqueIndex('orders_order_number_idx').on(table.orderNumber),
}))

export const orderItems = pgTable('orderItems', {
  id: serial('id').primaryKey(),
  orderId: integer('orderId').notNull(),
  productId: integer('productId').notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
  productIdIdx: index('order_items_product_id_idx').on(table.productId),
}))

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
