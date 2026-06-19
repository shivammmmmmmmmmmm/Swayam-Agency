'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X, Save, Upload, Camera, ImageIcon } from 'lucide-react'
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetCategories,
  adminCreateCategory,
  adminDeleteCategory,
} from '@/app/actions/admin'

interface Product {
  id: number
  name: string
  description: string | null
  categoryId: number
  price: number
  stock: number
  image: string | null
  specification: string | null
  slug: string
  featured: boolean | number
  createdAt: Date | string | null
}

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [message, setMessage] = useState('')

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: 0,
    price: 0,
    stock: 0,
    image: '',
    specification: '',
    slug: '',
    featured: false,
  })

  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' })

  const loadData = async () => {
    const [prodRes, catRes] = await Promise.all([
      adminGetProducts(search),
      adminGetCategories(),
    ])
    if (prodRes.success) setProducts(prodRes.data)
    if (catRes.success) setCategories(catRes.data)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleSearch = () => loadData()

  const resetForm = () => {
    setForm({ name: '', description: '', categoryId: 0, price: 0, stock: 0, image: '', specification: '', slug: '', featured: false })
  }

  const handleCreate = async () => {
    const result = await adminCreateProduct({
      ...form,
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      stock: Number(form.stock),
    })
    if (result.success) {
      setShowAddModal(false)
      resetForm()
      setMessage('Product created successfully!')
      loadData()
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const handleEdit = async () => {
    if (!editingProduct) return
    const result = await adminUpdateProduct(editingProduct.id, {
      ...form,
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      stock: Number(form.stock),
    })
    if (result.success) {
      setShowEditModal(false)
      setEditingProduct(null)
      resetForm()
      setMessage('Product updated successfully!')
      loadData()
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    const result = await adminDeleteProduct(id)
    if (result.success) {
      setMessage('Product deleted!')
      loadData()
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      image: product.image || '',
      specification: product.specification || '',
      slug: product.slug,
      featured: Boolean(product.featured),
    })
    setShowEditModal(true)
  }

  const handleCreateCategory = async () => {
    const result = await adminCreateCategory(categoryForm)
    if (result.success) {
      setCategoryForm({ name: '', slug: '', description: '' })
      setMessage('Category created!')
      loadData()
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return
    const result = await adminDeleteCategory(id)
    if (result.success) {
      setMessage('Category deleted!')
      loadData()
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Manage Categories
          </button>
          <button
            onClick={() => { resetForm(); setShowAddModal(true) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Search */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button onClick={handleSearch} className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700">Search</button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Stock</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Featured</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No products found</td>
                </tr>
              ) : (
                products.map((product) => {
                  const cat = categories.find((c) => c.id === product.categoryId)
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-gray-600">{cat?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-right">₹{product.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right">{product.stock}</td>
                      <td className="px-4 py-3 text-center">
                        {product.featured ? (
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Yes</span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add New Product">
          <ProductForm form={form} setForm={setForm} categories={categories} />
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Save className="w-4 h-4" /> Create Product
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit Product">
          <ProductForm form={form} setForm={setForm} categories={categories} />
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Save className="w-4 h-4" /> Update Product
            </button>
          </div>
        </Modal>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <Modal onClose={() => setShowCategoryModal(false)} title="Manage Categories">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="slug (e.g. surgical-tools)"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button onClick={handleCreateCategory} className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Add Category
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500">/{cat.slug}</p>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Modal Component ────────────────────────────────────────────────────────

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Product Form Component ─────────────────────────────────────────────────

function ProductForm({
  form,
  setForm,
  categories,
}: {
  form: any
  setForm: (f: any) => void
  categories: Category[]
}) {
  const update = (key: string, value: any) => setForm({ ...form, [key]: value })

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const uploadImage = async (file?: File) => {
    if (!file) return
    setUploadError('')
    setUploading(true)

    const payload = new FormData()
    payload.append('image', file)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: payload,
      })
      const result = await response.json()

      if (!response.ok) {
        setUploadError(result.error || 'Failed to upload image')
        return
      }

      update('image', result.url)
    } catch {
      setUploadError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => update('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => update('stock', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <label className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                Upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => uploadImage(e.target.files?.[0])}
                  disabled={uploading}
                />
              </label>
              <label className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Camera className="h-4 w-4" />
                Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(e) => uploadImage(e.target.files?.[0])}
                  disabled={uploading}
                />
              </label>
            </div>
            {form.image ? (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
                <img
                  src={form.image}
                  alt=""
                  className="h-14 w-14 rounded-md border border-gray-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-700">{form.image}</p>
                  <button
                    type="button"
                    onClick={() => update('image', '')}
                    className="mt-1 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-16 items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs font-medium text-gray-500">
                <ImageIcon className="h-4 w-4" />
                No image selected
              </div>
            )}
            {uploading && <p className="text-xs font-medium text-blue-600">Uploading image...</p>}
            {uploadError && <p className="text-xs font-medium text-red-600">{uploadError}</p>}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Specification (JSON)</label>
        <textarea
          value={form.specification}
          onChange={(e) => update('specification', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono"
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update('featured', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">Featured Product</span>
      </label>
    </div>
  )
}
