'use client'

import { useState } from 'react'
import type { Blog, Media } from '@/payload-types'
import styles from './styles.module.css'

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'tours', label: 'Tours' },
  { key: 'news', label: 'Noticias' },
  { key: 'destinations', label: 'Destinos' },
  { key: 'trips', label: 'Viajes' },
]

const CATEGORY_META: Record<string, { bg: string; color: string; label: string }> = {
  tours: { bg: '#EAF0FB', color: '#264F8B', label: 'Tours' },
  news: { bg: '#CEFFE3', color: '#28AF60', label: 'Noticias' },
  destinations: { bg: '#FDF2C8', color: '#F39C12', label: 'Destinos' },
  trips: { bg: '#E8FBF6', color: '#0A8F6C', label: 'Viajes' },
}

interface Props {
  posts: Blog[]
}

export const NewsListClient = ({ posts }: Props) => {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all' ? posts : posts.filter((p) => p.category === activeCategory)

  return (
    <div>
      <div className={styles.categoryTabs}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.categoryTab}${activeCategory === cat.key ? ` ${styles.categoryTabActive}` : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={styles.emptyState}>No hay artículos en esta categoría.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((post) => {
            const imgUrl =
              typeof post.coverImage === 'string'
                ? post.coverImage
                : ((post.coverImage as Media)?.url ?? '/assets/img/card.png')
            const cat = CATEGORY_META[post.category]

            return (
              <article key={post.id} className={styles.card}>
                <div className={styles.cardImgWrapper}>
                  <img src={imgUrl} alt={post.title} className={styles.cardImg} />
                  {cat && (
                    <span
                      className={styles.categoryBadge}
                      style={{ background: cat.bg, color: cat.color }}
                    >
                      {cat.label}
                    </span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <time className={styles.cardDate}>
                    {new Date(post.createdAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
