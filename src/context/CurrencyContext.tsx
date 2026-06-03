'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const CACHE_KEY = 'currency_rate_cache'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

type CurrencyCache = {
  currency: string
  rate: number
  timestamp: number
}

type CurrencyContextValue = {
  currency: string
  rate: number
  setByCountry: (currency: string) => Promise<void>
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  rate: 1,
  setByCountry: async () => {},
})

function loadCache(): CurrencyCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: CurrencyCache = JSON.parse(raw)
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) return null
    return cached
  } catch {
    return null
  }
}

function saveCache(currency: string, rate: number) {
  try {
    const cache: CurrencyCache = { currency, rate, timestamp: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage no disponible (SSR o modo privado)
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState('USD')
  const [rate, setRate] = useState(1)

  const setByCountry = useCallback(async (newCurrency: string) => {
    if (newCurrency === 'USD') {
      setCurrency('USD')
      setRate(1)
      saveCache('USD', 1)
      return
    }

    // Revisar cache primero
    const cached = loadCache()
    if (cached && cached.currency === newCurrency) {
      setCurrency(cached.currency)
      setRate(cached.rate)
      return
    }

    try {
      const res = await fetch(`/api/exchange-rate?currency=${newCurrency}`)
      if (!res.ok) throw new Error(`Rate fetch failed: ${res.status}`)
      const data = await res.json()
      const fetchedRate: number = data.rates?.[newCurrency] ?? 1
      setCurrency(newCurrency)
      setRate(fetchedRate)
      saveCache(newCurrency, fetchedRate)
    } catch {
      // Si falla la API, mantener currency pero sin conversión
      setCurrency(newCurrency)
      setRate(1)
    }
  }, [])

  return (
    <CurrencyContext.Provider value={{ currency, rate, setByCountry }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
