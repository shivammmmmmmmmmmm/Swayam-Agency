import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WishlistContent } from '@/components/wishlist-content'

export const metadata = {
  title: 'My Wishlist - Swayam Agency',
  description: 'View your saved medical instruments',
}

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <WishlistContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
