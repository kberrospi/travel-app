import { FC } from 'react'
import type { Media, Travel } from '@/payload-types'
import style from '../styles.module.css'

interface Props {
  images: Travel['images']
}

const resolveUrl = (img: string | Media): string =>
  typeof img === 'string' ? img : (img.url ?? '')

export const GalleryGrid: FC<Props> = ({ images }) => {
  const list = images ?? []
  const main = list[0]
  const thumbs = list.slice(1, 5)

  return (
    <div className={style.containerImages}>
      <img className={style.main} src={resolveUrl(main.image)} alt="" />
      {thumbs.map((item) => (
        <img key={item.id} className={style.thumb} src={resolveUrl(item.image)} alt="" />
      ))}
    </div>
  )
}
