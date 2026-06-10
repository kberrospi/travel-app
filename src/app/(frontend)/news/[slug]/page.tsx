import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Blog } from '@/payload-types'
import { LexicalRenderer } from './LexicalRenderer'
import styles from './style.module.css'

const CATEGORY_META: Record<string, { bg: string; color: string; label: string }> = {
  tours: { bg: '#EAF0FB', color: '#264F8B', label: 'Tours' },
  news: { bg: '#CEFFE3', color: '#28AF60', label: 'Noticias' },
  destinations: { bg: '#FDF2C8', color: '#F39C12', label: 'Destinos' },
  trips: { bg: '#E8FBF6', color: '#0A8F6C', label: 'Viajes' },
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'blog',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    overrideAccess: true,
  })

  const post = docs[0] as Blog | undefined
  if (!post) notFound()

  const { docs: recentPosts } = await payload.find({
    collection: 'blog',
    depth: 1,
    limit: 4,
    sort: '-createdAt',
    overrideAccess: true,
  })

  const recent = recentPosts.filter((p) => p.id !== post.id).slice(0, 3) as Blog[]

  const imgUrl =
    typeof post.coverImage === 'string'
      ? post.coverImage
      : ((post.coverImage as Media)?.url ?? '/assets/img/card.png')

  const cat = CATEGORY_META[post.category]

  const categories = [
    { key: 'news', label: 'Noticias' },
    { key: 'tours', label: 'Tours' },
    { key: 'destinations', label: 'Destinos' },
    { key: 'trips', label: 'Viajes' },
  ]

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          {cat && <span className={styles.pageHeaderLabel}>{cat.label}</span>}
          <h1 className={styles.pageHeaderTitle}>{post.title}</h1>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.layout}>
          <article className={styles.article}>
            <div className={styles.coverWrapper}>
              <img src={imgUrl} alt={post.title} className={styles.coverImg} />
            </div>

            <div className={styles.articleMeta}>
              {cat && (
                <span className={styles.categoryTag} style={{ color: cat.color }}>
                  • {cat.label.toUpperCase()}
                </span>
              )}
              <time className={styles.articleDate}>
                {new Date(post.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                })}
              </time>
            </div>

            <h2 className={styles.articleTitle}>{post.title}</h2>

            <LexicalRenderer content={post.content} className={styles.richText} />
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarSearch}>
              <span className={styles.searchIcon}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input type="text" placeholder="Buscar..." className={styles.searchInput} readOnly />
            </div>

            {/* Recent posts */}
            <div className={styles.sidebarBlock}>
              <h3 className={styles.sidebarTitle}>Posts Recientes</h3>
              <div className={styles.recentList}>
                {recent.map((p) => {
                  const recentImg =
                    typeof p.coverImage === 'string'
                      ? p.coverImage
                      : ((p.coverImage as Media)?.url ?? '/assets/img/card.png')
                  return (
                    <Link key={p.id} href={`/news/${p.slug ?? p.id}`} className={styles.recentItem}>
                      <img src={recentImg} alt={p.title} className={styles.recentThumb} />
                      <div className={styles.recentInfo}>
                        <span className={styles.recentTitle}>{p.title}</span>
                        <time className={styles.recentDate}>
                          {new Date(p.createdAt).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                          })}
                        </time>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Categories */}
            <div className={styles.sidebarBlock}>
              <h3 className={styles.sidebarTitle}>Categorías</h3>
              <div className={styles.categoryPills}>
                {categories.map((c) => (
                  <Link
                    key={c.key}
                    href={`/news?category=${c.key}`}
                    className={`${styles.categoryPill}${post.category === c.key ? ` ${styles.categoryPillActive}` : ''}`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
