import { Travel } from '@/payload-types'
import style from '../styles.module.css'
import { Accordion } from '@heroui/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PinLocation03Icon } from '@hugeicons-pro/core-stroke-rounded'

interface Props extends Pick<Travel, 'itinerary'> {}

export const Itinerary = ({ itinerary }: Props) => {
  return (
    <div className={style.containerItinerary}>
      <h3>Itinerario de viaje</h3>
      {itinerary?.map((item, index) => (
        <Accordion allowsMultipleExpanded className="w-full" key={index}>
          <Accordion.Item>
            <Accordion.Heading className={style.headingAccordion}>
              <Accordion.Trigger className={style.triggerAccordion}>
                <div className={style.headerItinerary}>
                  <div className={style.headerItineraryDay}>
                    <HugeiconsIcon icon={PinLocation03Icon} width={'15px'} />
                    <span>Dia</span>
                    <span>{item.day}</span>
                  </div>
                  <div>{item.title}</div>
                </div>

                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel className={style.panelAccordion}>
              <Accordion.Body className={style.bodyAccordion}>{item.description}</Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ))}
    </div>
  )
}
