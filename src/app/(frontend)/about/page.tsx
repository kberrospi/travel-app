import { HugeiconsIcon } from '@hugeicons/react'
import {
  AirplaneTakeOff01Icon,
  MapsLocation01Icon,
  HeadsetIcon,
  ShieldKeyIcon,
  HappyIcon,
} from '@hugeicons-pro/core-stroke-rounded'
import { STATIC_ITEMS } from '@/utils'
import styles from './styles.module.css'

export const metadata = {
  title: 'Sobre Nosotros | Traveler',
  description:
    'Conoce a Europa Bajo Costo: quiénes somos, nuestra misión, visión y los valores que nos guían.',
}

const VALUES = [
  {
    icon: HeadsetIcon,
    title: 'Servicio personalizado',
    description:
      'Atendemos cada solicitud de manera individual para garantizar la mejor experiencia de viaje.',
    bg: '#EAF0FB',
    color: '#5C98F2',
  },
  {
    icon: ShieldKeyIcon,
    title: 'Confianza y seguridad',
    description:
      'Operamos con total transparencia para que tu viaje sea seguro y sin sorpresas desde el inicio.',
    bg: '#CEFFE3',
    color: '#28AF60',
  },
  {
    icon: HappyIcon,
    title: 'Satisfacción garantizada',
    description:
      'Tu felicidad es nuestra prioridad. No descansamos hasta que cada detalle de tu viaje sea perfecto.',
    bg: '#FDF2C8',
    color: '#F39C12',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.pageHeaderLabel}>Quiénes somos</p>
          <h1 className={styles.pageHeaderTitle}>Sobre Nosotros</h1>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className={styles.missionSection}>
        <div className={styles.sectionInner}>
          <div className={styles.missionContent}>
            <div className={styles.missionText}>
              <span className={styles.sectionLabel}>Nuestra historia</span>
              <h2 className={styles.sectionTitle}>Hacemos del mundo tu hogar</h2>
              <p className={styles.sectionDescription}>
                En <strong>Europa Bajo Costo</strong>, creemos que viajar transforma vidas. Nuestra
                misión es conectar a las personas con experiencias auténticas alrededor del mundo,
                ofreciendo planes de viaje accesibles, seguros y verdaderamente memorables.
              </p>
              <p className={styles.sectionDescription}>
                Llevamos años organizando viajes soñados para nuestros clientes en Latinoamérica,
                asegurándonos de que cada detalle cuente y que cada aventura supere las
                expectativas.
              </p>
            </div>
            <div className={styles.missionCards}>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon} style={{ background: '#EAF0FB' }}>
                  <HugeiconsIcon
                    icon={AirplaneTakeOff01Icon}
                    color="#5C98F2"
                    width="32px"
                    height="32px"
                  />
                </div>
                <h3 className={styles.missionCardTitle}>Misión</h3>
                <p className={styles.missionCardText}>
                  Hacer accesible el turismo mundial con experiencias personalizadas y de alta
                  calidad para cada viajero.
                </p>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionCardIcon} style={{ background: '#CEFFE3' }}>
                  <HugeiconsIcon
                    icon={MapsLocation01Icon}
                    color="#28AF60"
                    width="32px"
                    height="32px"
                  />
                </div>
                <h3 className={styles.missionCardTitle}>Visión</h3>
                <p className={styles.missionCardText}>
                  Ser la agencia de viajes de referencia en Latinoamérica para el turismo europeo y
                  mundial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Lo que nos define</span>
            <h2 className={styles.sectionTitle}>Nuestros valores</h2>
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map((val) => (
              <div key={val.title} className={styles.valueCard}>
                <div className={styles.valueIconWrap} style={{ background: val.bg }}>
                  <HugeiconsIcon icon={val.icon} color={val.color} width="32px" height="32px" />
                </div>
                <h3 className={styles.valueTitle}>{val.title}</h3>
                <p className={styles.valueText}>{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
          {STATIC_ITEMS.map((item, i) => (
            <div key={i} className={styles.statItem}>
              <HugeiconsIcon icon={item.icon} color="#739AE7" width="36px" height="36px" />
              <span className={styles.statNumber}>{item.number}</span>
              <span className={styles.statLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
