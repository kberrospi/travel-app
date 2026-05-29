'use client'

import { useCurrency } from '@/context/CurrencyContext'

interface Props {
  priceUSD: number
}

export function PriceDisplay({ priceUSD }: Props) {
  const { currency, rate } = useCurrency()
  const converted = priceUSD * rate

  return (
    <span>
      {converted.toLocaleString('es-CO', { style: 'decimal', maximumFractionDigits: 0 })} {currency}
    </span>
  )
}
