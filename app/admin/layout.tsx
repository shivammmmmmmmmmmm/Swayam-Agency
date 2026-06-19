'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Check if user is admin on mount
  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data } = await authClient.getSession()
        if (!data?.user) {
          router.push('/sign-in')
          return
        }
        // Verify admin status via a lightweight check
        const adminCheck = await fetch('/api/admin/check')
        const adminData = await adminCheck.json()
        if (!adminData.isAdmin) {
          router.push('/')
        }
      } catch {
        router.push('/sign-in')
      }
    }
    checkAdmin()
  }, [router])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push('/sign-in')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/admin" className="text-xl font-bold text-blue-600">
              Swayam Admin
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
              aria-label="Open admin menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Swayam Admin</h1>
              <p className="hidden text-xs font-medium text-gray-500 sm:block">
                Admin control panel
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
