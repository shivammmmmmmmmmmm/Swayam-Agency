'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, Users, IndianRupee, AlertCircle, PlusCircle, ListOrdered } from 'lucide-react'
import { getAdminDashboardStats } from '@/app/actions/admin'

interface DashboardData {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalUsers: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const result = await getAdminDashboardStats()
      if (result.success && result.data) {
        setStats(result.data)
      } else {
        setError(result.error || 'Failed to load stats')
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  const cards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: 'bg-green-500',
      href: '/admin/orders',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders ?? 0,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      href: '/admin/orders',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'bg-purple-500',
      href: '#',
    },
    {
      label: 'Revenue',
      value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-emerald-500',
      href: '/admin/orders',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the Swayam Agency admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`${card.color} p-3 rounded-lg inline-block mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="bg-blue-100 p-3 rounded-lg">
              <PlusCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add New Product</p>
              <p className="text-sm text-gray-500">Create a new medical instrument listing</p>
            </div>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <ListOrdered className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-500">View and update order statuses</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}