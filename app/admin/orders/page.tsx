'use client'

import { useState, useEffect } from 'react'
import { Search, X, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import {
  adminGetOrders,
  adminGetOrderDetails,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus,
} from '@/app/actions/admin'

interface Order {
  id: number
  orderNumber: string
  userId: string
  status: string
  paymentMethod: string
  paymentStatus: string
  totalAmount: number
  taxAmount: number
  shippingAmount: number
  addressId: number
  notes: string | null
  createdAt: Date | string | null
}

interface OrderDetails {
  order: Order
  items: Array<{
    id: number
    orderId: number
    productId: number
    quantity: number
    price: number
  }>
  user: {
    id: string
    name: string
    email: string
  } | null
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [message, setMessage] = useState('')

  const loadOrders = async (status?: string) => {
    setLoading(true)
    const result = await adminGetOrders(status)
    if (result.success) setOrders(result.data)
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [])

  useEffect(() => {
    loadOrders(statusFilter)
  }, [statusFilter])

  const viewOrder = async (id: number) => {
    const result = await adminGetOrderDetails(id)
    if (result.success && result.data) {
      setSelectedOrder(result.data as OrderDetails)
      setShowDetail(true)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    const result = await adminUpdateOrderStatus(id, status)
    if (result.success) {
      setMessage(`Order #${id} status updated to ${status}`)
      loadOrders(statusFilter)
      if (selectedOrder?.order.id === id) {
        setSelectedOrder({ ...selectedOrder, order: { ...selectedOrder.order, status } })
      }
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const updatePayment = async (id: number, paymentStatus: string) => {
    const result = await adminUpdatePaymentStatus(id, paymentStatus)
    if (result.success) {
      setMessage(`Payment status updated to ${paymentStatus}`)
      loadOrders(statusFilter)
      if (selectedOrder?.order.id === id) {
        setSelectedOrder({ ...selectedOrder, order: { ...selectedOrder.order, paymentStatus } })
      }
    } else {
      setMessage(`Error: ${result.error}`)
    }
  }

  const formatDate = (d: Date | string | null) => {
    if (!d) return 'N/A'
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading && orders.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer orders</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{order.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.paymentStatus}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">({order.paymentMethod})</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => viewOrder(order.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetail && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetail(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Order #{selectedOrder.order.orderNumber}</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.order.createdAt)}</p>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Customer</h3>
              <p className="text-sm text-gray-900">{selectedOrder.user?.name || 'N/A'}</p>
              <p className="text-sm text-gray-500">{selectedOrder.user?.email || 'N/A'}</p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Product #{item.productId}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-sm font-medium">₹{(item.quantity * item.price).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{(selectedOrder.order.totalAmount - selectedOrder.order.taxAmount - selectedOrder.order.shippingAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">₹{selectedOrder.order.shippingAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">₹{selectedOrder.order.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{selectedOrder.order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Payment</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Method: {selectedOrder.order.paymentMethod}</span>
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${paymentStatusColors[selectedOrder.order.paymentStatus] || 'bg-gray-100'}`}>
                  {selectedOrder.order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.order.notes && (
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800"><strong>Notes:</strong> {selectedOrder.order.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Update Order</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Order Status</label>
                  <select
                    value={selectedOrder.order.status}
                    onChange={(e) => updateStatus(selectedOrder.order.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Payment Status</label>
                  <select
                    value={selectedOrder.order.paymentStatus}
                    onChange={(e) => updatePayment(selectedOrder.order.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}