'use client'

import { useEffect, useState } from 'react'
import type { Country } from '@/payload-types'
import { useCurrency } from '@/context/CurrencyContext'

interface Props {
  countries: Country[]
}

export function CountrySelector({ countries }: Props) {
  const { setByCountry } = useCurrency()
  const [selected, setSelected] = useState('')

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        const detectedCode: string = data.country_code ?? ''

        const match = countries.find((c) => c.code === detectedCode)
        if (match) {
          setSelected(match.code)
          await setByCountry(match.currency)
        } else if (countries[0]) {
          // Si el país detectado no está en la lista, usar el primero
          setSelected(countries[0].code)
          await setByCountry(countries[0].currency)
        }
      } catch {
        // Si falla la geolocalización, usar el primer país de la lista
        if (countries[0]) {
          setSelected(countries[0].code)
          await setByCountry(countries[0].currency)
        }
      }
    }

    detectCountry()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value
    setSelected(code)
    const country = countries.find((c) => c.code === code)
    if (country) {
      await setByCountry(country.currency)
    }
  }

  return (
    <select name="Country" id="Country" value={selected} onChange={handleChange}>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  )
}
