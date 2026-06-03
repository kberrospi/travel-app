import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import style from './styles.module.css'
import { FormTravel, GalleryGrid, ItemsToTravel, Itinerary, TravelDetail } from './components'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function TravelDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'travel',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const travel = result.docs[0]

  if (!travel) {
    notFound()
  }

  return (
    <main className={style.containerTravelDetail}>
      <h1 className={style.travelTitle}>{travel.title}</h1>
      <GalleryGrid images={travel.images} />
      <TravelDetail
        price={travel.price}
        days={travel.days}
        travelers={travel.travelers}
        travelStyle={travel.travelStyle}
        methodPayment={travel.methodPayment}
      />
      <div className={style.containerDataTravel}>
        <div className={style.contentDataTravel}>
          <div className={style.containerTravelDescription}>
            <h3>De que trata esta aventura?</h3>
            <span>{travel.description}</span>
          </div>
          <ItemsToTravel
            excludedItems={travel.excludedItems}
            includedItems={travel.includedItems}
          />
          <Itinerary itinerary={travel.itinerary} />
        </div>
        <div className={style.contentFormTravel}>
          <FormTravel travelId={travel.id} />
        </div>
      </div>
    </main>
  )
}
