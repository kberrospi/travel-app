import React from 'react'
import './global.css'
import { Outfit } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Footer, Sidebar } from '@/components'
import { CurrencyProvider } from '@/context/CurrencyContext'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata = {
  description: 'Website to travel around the world',
  title: 'Traveler',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const payload = await getPayload({ config })
  const ALLOWED_COUNTRY_CODES = ['CO', 'CL', 'PE', 'VE', 'MX', 'PA', 'US']

  const { docs: countries } = await payload.find({
    collection: 'countries',
    where: { code: { in: ALLOWED_COUNTRY_CODES } },
    limit: ALLOWED_COUNTRY_CODES.length,
    depth: 0,
  })

  return (
    <html lang="en">
      <body className={outfit.className}>
        <CurrencyProvider>
          <Sidebar countries={countries} />
          <main>{children}</main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  )
}
