import { Suspense } from 'react'
import { getProductBySlug } from '@/app/actions/products'
import { ProductDetail } from '@/components/product-detail'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const result = await getProductBySlug(slug)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <ProductDetail product={result.data} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
