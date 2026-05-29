import { headers as getHeaders } from 'next/headers.js'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  Configuration01Icon,
  DocumentValidationIcon,
  ShieldKeyIcon,
} from '@hugeicons-pro/core-stroke-rounded'
import { getPayload } from 'payload'

import config from '@/payload.config'
import style from './styles.module.css'
import { CardTravel } from '@/components'
import { Button } from '@heroui/react'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const { docs: travels } = await payload.find({
    collection: 'travel',
    where: { isActive: { equals: true } },
    depth: 1,
  })

  return (
    <div>
      <section className={style.containerBanner}>
        <img src="/assets/img/bannerP.png" alt="Banner Principal" className={style.bannerImg} />
        <div className={style.bannerText}>
          <span>Explora el mundo</span>
          <h1>Disfrutando las maravillas del viaje</h1>
          <p>
            Disfruta de las impresionantes vistas de la naturaleza, relájate y aprecia tu sueño de
            viajar.
          </p>
        </div>
      </section>
      <section className={style.sectionFeatures}>
        <div className={style.featuresText}>
          <span className={style.featuresTextTitle}>Caracteristicas principales</span>
          <h2>Ofrecemos el mejor servicio</h2>
          <p className={style.featuresTextDescription}>
            EBC nunca deja de servirte con los mejores viajes a europa. Nuestro objetico es hacer de
            tu viaje una experiencia inolvidable.
          </p>
          <div className={style.containerFeatures}>
            <div className={style.contentFeatures}>
              <div style={{ backgroundColor: '#F1F5FD' }} className={style.contentFeatureIcon}>
                <HugeiconsIcon
                  icon={DocumentValidationIcon}
                  color="#5C98F2"
                  width={'45px'}
                  height={'45px'}
                />
              </div>
              <div className={style.contentFeatureText}>
                <span>Muchas opciones</span>
                <p>Ofrecemos una amplia variedad de destinos para que tu viaje sea único.</p>
              </div>
            </div>
            <div className={style.contentFeatures}>
              <div className={style.contentFeatureIcon} style={{ backgroundColor: '#CEFFE3' }}>
                <HugeiconsIcon
                  icon={ShieldKeyIcon}
                  color="#28AF60"
                  width={'45px'}
                  height={'45px'}
                />
              </div>
              <div className={style.contentFeatureText}>
                <span>Confiable y seguro</span>
                <p>Nos aseguramos de que tu viaje sea seguro y confiable.</p>
              </div>
            </div>
            <div className={style.contentFeatures}>
              <div className={style.contentFeatureIcon} style={{ backgroundColor: '#FDF2C8' }}>
                <HugeiconsIcon
                  icon={Configuration01Icon}
                  color="#F39C12"
                  width={'45px'}
                  height={'45px'}
                />
              </div>
              <div className={style.contentFeatureText}>
                <span>Viajes personalizados</span>
                <p>Ofrecemos viajes adaptados a tus necesidades y preferencias.</p>
              </div>
            </div>
          </div>
        </div>
        <div className={style.featuresImg}>
          <img src="/assets/img/sectionFeature.png" alt="feature" />
          <span>Explora el mundo con EBC</span>
        </div>
      </section>
      <section className={style.sectionDestinations}>
        <div className={style.containerDestinations}>
          <div className={style.headerDestinations}>
            <div className={style.headerDestinationsText}>
              <span>Destinos perfectos</span>
              <p>Mas de 80 planes de viaje para ti </p>
            </div>
            <div className={style.headerDestinationsLink}>
              <a href="/travel">
                <span>Ver todas las aventuras</span>
                <Button isIconOnly className={style.buttonTravels}>
                  <HugeiconsIcon icon={ArrowRight01Icon} />
                </Button>
              </a>
            </div>
          </div>
          <div className={style.cardsDestinations}>
            {travels.map((travel) => (
              <CardTravel
                key={travel.id}
                coverImage={travel.coverImage}
                title={travel.title}
                price={travel.price}
                duration={`${travel.days} días`}
                slug={travel.slug ?? travel.id}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
