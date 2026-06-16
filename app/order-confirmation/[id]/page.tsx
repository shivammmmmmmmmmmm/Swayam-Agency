import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { OrderConfirmation } from '@/components/order-confirmation'

export const metadata = {
  title: 'Order Confirmed - Swayam Agency',
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <OrderConfirmation />
      </main>
      <Footer />
    </div>
  )
}
