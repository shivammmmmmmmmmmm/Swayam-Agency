import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Globe, CheckCircle2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/swayam-logo.png"
                alt="Swayam Agency"
                width={42}
                height={42}
                className="h-10 w-auto"
              />
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-slate-950">Swayam Agency</h3>
                <p className="text-xs font-semibold text-slate-500">Premium medical procurement</p>
              </div>
            </div>
            <p className="max-w-sm text-sm font-medium leading-6 text-slate-600">
              Distributor of medical, hospital, and pathology instruments for clinics, labs, and enterprise healthcare buyers.
            </p>

            <div className="mt-5 space-y-2">
              {['Certified Medical Supplier', 'ISO Compliant Products', 'Fast Delivery Available'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-400">Shopping</h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-600">
              {[
                ['Browse Products', '/'],
                ['Saved for Later', '/wishlist'],
                ['Shopping Cart', '/cart'],
                ['Order History', '/orders'],
                ['Delivery Addresses', '/account/addresses'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-400">Resources</h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-600">
              {['About Swayam Agency', 'Product Guide', 'Medical Standards', 'Contact Support', 'FAQs'].map((item) => (
                <li key={item}>
                  <a href="#" className="transition hover:text-primary">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-400">Contact</h4>
            <div className="space-y-3 text-sm font-semibold text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>Shop No. 1, House No. 5, Gawali Nagar, Nanded Road, Latur</span>
              </div>
              <a href="tel:+919890509712" className="flex items-center gap-2 transition hover:text-primary">
                <Phone className="h-4 w-4 text-primary" />
                +91 9890509712
              </a>
              <a href="mailto:swayam.agency1870@gmail.com" className="flex items-center gap-2 transition hover:text-primary">
                <Mail className="h-4 w-4 text-primary" />
                swayam.agency1870@gmail.com
              </a>
              <a href="https://swayamagency.link" target="_blank" className="flex items-center gap-2 transition hover:text-primary">
                <Globe className="h-4 w-4 text-primary" />
                swayamagency.link
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Created by Shivam Bhalerao. All rights reserved.</p>
          <p>GST: 27ASQPP9608M1ZQ · Lic: MH LAT 467124, 20B 467123</p>
        </div>
      </div>
    </footer>
  )
}
