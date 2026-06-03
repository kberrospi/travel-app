'use client'

import { useMemo, useState } from 'react'
import { CardTravel } from '@/components'
import type { Travel } from '@/payload-types'
import styles from '../styles.module.css'

type SortOption = 'title' | 'price-asc' | 'days-asc'
type DurationBucket = '1' | '2-3' | '4-7' | '7+'

interface Props {
  travels: Travel[]
  maxPrice: number
}

const DURATION_OPTIONS: { label: string; value: DurationBucket }[] = [
  { label: '1 día', value: '1' },
  { label: '2 - 3 días', value: '2-3' },
  { label: '4 - 7 días', value: '4-7' },
  { label: 'Más de 7 días', value: '7+' },
]

const STYLE_OPTIONS: { label: string; value: 'all' | 'private' | 'group' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Privado', value: 'private' },
  { label: 'Grupal', value: 'group' },
]

function getDurationBucket(days: number): DurationBucket {
  if (days <= 1) return '1'
  if (days <= 3) return '2-3'
  if (days <= 7) return '4-7'
  return '7+'
}

export default function TravelListClient({ travels, maxPrice }: Props) {
  const [minPrice, setMinPrice] = useState(0)
  const [currentMax, setCurrentMax] = useState(maxPrice)
  const [selectedDurations, setSelectedDurations] = useState<DurationBucket[]>([])
  const [selectedStyle, setSelectedStyle] = useState<'all' | 'private' | 'group'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('title')

  const hasActiveFilters =
    minPrice > 0 || currentMax < maxPrice || selectedDurations.length > 0 || selectedStyle !== 'all'

  const activeCount =
    (minPrice > 0 || currentMax < maxPrice ? 1 : 0) +
    (selectedDurations.length > 0 ? 1 : 0) +
    (selectedStyle !== 'all' ? 1 : 0)

  const filtered = useMemo(() => {
    let result = travels.filter((t) => {
      if (t.price < minPrice || t.price > currentMax) return false
      if (selectedStyle !== 'all' && t.travelStyle !== selectedStyle) return false
      if (selectedDurations.length > 0 && !selectedDurations.includes(getDurationBucket(t.days)))
        return false
      return true
    })

    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price)
      case 'days-asc':
        return [...result].sort((a, b) => a.days - b.days)
      default:
        return [...result].sort((a, b) => a.title.localeCompare(b.title, 'es-CO'))
    }
  }, [travels, minPrice, currentMax, selectedStyle, selectedDurations, sortBy])

  const clearFilters = () => {
    setMinPrice(0)
    setCurrentMax(maxPrice)
    setSelectedDurations([])
    setSelectedStyle('all')
  }

  const toggleDuration = (bucket: DurationBucket) =>
    setSelectedDurations((prev) =>
      prev.includes(bucket) ? prev.filter((d) => d !== bucket) : [...prev, bucket],
    )

  const minPercent = maxPrice > 0 ? (minPrice / maxPrice) * 100 : 0
  const maxPercent = maxPrice > 0 ? (currentMax / maxPrice) * 100 : 100

  return (
    <div className={styles.layout}>
      {/* ── Sidebar filtros ──────────────────────── */}
      <aside className={styles.sidebar}>
        {/* Precio */}
        <div className={styles.filterBlock}>
          <h3 className={styles.filterTitle}>Filtrar por Precio</h3>
          <div className={styles.rangeWrapper}>
            <div className={styles.rangeTrack}>
              <div
                className={styles.rangeProgress}
                style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={50}
              value={minPrice}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v <= currentMax) setMinPrice(v)
              }}
              className={styles.rangeInput}
            />
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={50}
              value={currentMax}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (v >= minPrice) setCurrentMax(v)
              }}
              className={styles.rangeInput}
            />
          </div>
          <p className={styles.rangeLabel}>
            Precio: ${minPrice.toLocaleString('es-CO')} – ${currentMax.toLocaleString('es-CO')}
          </p>
          <div className={styles.filterActions}>
            {hasActiveFilters && (
              <button onClick={clearFilters} className={styles.clearBtn}>
                Limpiar
              </button>
            )}
            {activeCount > 0 && (
              <span className={styles.activeCount}>
                {activeCount} activo{activeCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Duración */}
        <div className={styles.filterBlock}>
          <h3 className={styles.filterTitle}>Duración</h3>
          {DURATION_OPTIONS.map((opt) => (
            <label key={opt.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedDurations.includes(opt.value)}
                onChange={() => toggleDuration(opt.value)}
                className={styles.checkInput}
              />
              <span className={styles.checkCustom} />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Tipo de viaje */}
        <div className={styles.filterBlock}>
          <h3 className={styles.filterTitle}>Tipo de Viaje</h3>
          {STYLE_OPTIONS.map((opt) => (
            <label key={opt.value} className={styles.checkboxLabel}>
              <input
                type="radio"
                name="travelStyle"
                value={opt.value}
                checked={selectedStyle === opt.value}
                onChange={() => setSelectedStyle(opt.value)}
                className={styles.checkInput}
              />
              <span className={styles.radioCustom} />
              {opt.label}
            </label>
          ))}
        </div>
      </aside>

      {/* ── Contenido principal ─────────────────── */}
      <div className={styles.main}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <span className={styles.resultCount}>
            <strong>{filtered.length}</strong> viajes encontrados
          </span>
          <div className={styles.sortWrapper}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="6" y1="12" x2="18" y2="12" />
              <line x1="9" y1="18" x2="15" y2="18" />
            </svg>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={styles.sortSelect}
            >
              <option value="title">Título</option>
              <option value="price-asc">Precio (menor a mayor)</option>
              <option value="days-asc">Días (menor a mayor)</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((travel) => (
              <CardTravel
                key={travel.id}
                coverImage={travel.coverImage}
                title={travel.title}
                price={travel.price}
                duration={`${travel.days} día${travel.days === 1 ? '' : 's'}`}
                slug={travel.slug ?? travel.id}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-gray-medium)"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>No se encontraron viajes con los filtros seleccionados.</p>
            <button onClick={clearFilters} className={styles.clearBtnPrimary}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
