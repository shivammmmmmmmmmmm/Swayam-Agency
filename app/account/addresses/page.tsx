import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AddressesContent } from '@/components/addresses-content'

export const metadata = {
  title: 'My Addresses - Swayam Agency',
  description: 'Manage your delivery addresses',
}

export default function AddressesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <AddressesContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
