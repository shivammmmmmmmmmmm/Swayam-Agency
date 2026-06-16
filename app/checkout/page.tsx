import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckoutContent } from '@/components/checkout-content'

export const metadata = {
  title: 'Checkout - Swayam Agency',
  description: 'Complete your order',
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CheckoutContent />
      </main>
      <Footer />
    </div>
  )
}
