import { getPayload } from 'payload'
import config from '@payload-config'
import TravelListClient from './components/TravelListClient'
import styles from './styles.module.css'

export const dynamic = 'force-dynamic'

export default async function TravelPage() {
  const payload = await getPayload({ config })

  const { docs: travels } = await payload.find({
    collection: 'travel',
    where: { isActive: { equals: true } },
    limit: 100,
    depth: 1,
  })

  const maxPrice =
    travels.length > 0 ? Math.ceil(Math.max(...travels.map((t) => t.price)) / 100) * 100 : 5000

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.pageHeaderLabel}>Nuestros destinos</p>
          <h1 className={styles.pageHeaderTitle}>Planes de Viaje</h1>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <TravelListClient travels={travels} maxPrice={maxPrice} />
      </div>
    </section>
  )
}
