import { getPayload } from 'payload'
import config from '@payload-config'
import styles from './styles.module.css'
import { NewsListClient } from './NewsListClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog & Noticias | Traveler',
  description: 'Mantente informado con las últimas noticias de viajes, destinos y tours.',
}

export default async function NewsPage() {
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'blog',
    depth: 1,
    limit: 100,
    sort: '-createdAt',
  })

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.pageHeaderLabel}>Mantente informado</p>
          <h1 className={styles.pageHeaderTitle}>Blog &amp; Noticias</h1>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <NewsListClient posts={posts} />
      </div>
    </section>
  )
}
