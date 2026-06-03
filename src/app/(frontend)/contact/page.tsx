import { getPayload } from 'payload'
import config from '@payload-config'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  HeadsetIcon,
  MapsLocation01Icon,
  AirplaneTakeOff01Icon,
} from '@hugeicons-pro/core-stroke-rounded'
import styles from './styles.module.css'
import { ContactForm } from './ContactForm'

export const metadata = {
  title: 'Contáctanos | Traveler',
  description: 'Escríbenos y uno de nuestros asesores te atenderá a la brevedad.',
}

const CONTACT_ITEMS = [
  {
    icon: HeadsetIcon,
    iconBg: '#EAF0FB',
    iconColor: '#5C98F2',
    label: 'Soporte',
    value: 'info@europabajocosto.com',
  },
  {
    icon: AirplaneTakeOff01Icon,
    iconBg: '#CEFFE3',
    iconColor: '#28AF60',
    label: 'WhatsApp',
    value: '+57 310 000 0000',
  },
  {
    icon: MapsLocation01Icon,
    iconBg: '#FDF2C8',
    iconColor: '#F39C12',
    label: 'Ubicación',
    value: 'Colombia, Latinoamérica',
  },
]

export default async function ContactPage() {
  const payload = await getPayload({ config })
  const { docs: travels } = await payload.find({
    collection: 'travel',
    where: { isActive: { equals: true } },
    limit: 100,
    depth: 0,
  })

  const travelOptions = travels.map((t) => ({ id: t.id, title: t.title }))

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.pageHeaderLabel}>Estamos aquí para ti</p>
          <h1 className={styles.pageHeaderTitle}>Contáctanos</h1>
        </div>
      </div>

      {/* Content */}
      <section className={styles.contentSection}>
        <div className={styles.contentInner}>
          {/* Info column */}
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Hablemos</span>
            <h2 className={styles.infoTitle}>¿Listo para tu próxima aventura?</h2>
            <p className={styles.infoDescription}>
              Nuestro equipo de asesores especializados está listo para ayudarte a planificar el
              viaje de tus sueños. Escríbenos y te respondemos a la brevedad.
            </p>

            <div className={styles.contactItems}>
              {CONTACT_ITEMS.map((item) => (
                <div key={item.label} className={styles.contactItem}>
                  <div className={styles.contactIcon} style={{ background: item.iconBg }}>
                    <HugeiconsIcon
                      icon={item.icon}
                      color={item.iconColor}
                      width="22px"
                      height="22px"
                    />
                  </div>
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>{item.label}</span>
                    <span className={styles.contactValue}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <ContactForm travels={travelOptions} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
