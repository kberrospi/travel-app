import { FC } from 'react'
import Link from 'next/link'
import { Button, Card } from '@heroui/react'
import style from './styles.module.css'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, TimeScheduleIcon } from '@hugeicons-pro/core-stroke-rounded'
import type { Media } from '@/payload-types'

interface props {
  coverImage: string | Media
  title: string
  price: number
  duration: string
  slug: string
}

export const CardTravel: FC<props> = ({ coverImage, title, price, duration, slug }) => {
  const imgUrl =
    typeof coverImage === 'string' ? coverImage : (coverImage.url ?? 'assets/img/card.png')

  return (
    <Card className={style.containerCard}>
      <img src={imgUrl} alt={title} width={'300px'} />
      <Card.Header className={style.bodyCard}>
        <Card.Title className={style.title}>{title}</Card.Title>
        <Card.Description className={style.price}>
          Desde
          <span>
            {price.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })}
          </span>
        </Card.Description>
        <span className={style.duration}>
          <HugeiconsIcon icon={TimeScheduleIcon} width={'18px'} height={'18px'} /> {duration}
        </span>
      </Card.Header>
      <Card.Footer className={style.footerCard}>
        <Link className={style.link} href={`/travel/${slug}`}>
          <span>Mas información</span>
          <Button isIconOnly className={style.buttonTravels}>
            <HugeiconsIcon icon={ArrowRight01Icon} width={'15px'} height={'15px'} />
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  )
}
