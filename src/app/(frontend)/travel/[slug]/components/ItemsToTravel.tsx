import { Travel } from '@/payload-types'
import { FC } from 'react'
import style from '../styles.module.css'
import { HugeiconsIcon } from '@hugeicons/react'
import { CancelCircleIcon, CheckmarkCircle02Icon } from '@hugeicons-pro/core-stroke-rounded'

interface Props extends Pick<Travel, 'excludedItems' | 'includedItems'> {}

export const ItemsToTravel: FC<Props> = ({ excludedItems, includedItems }) => {
  return (
    <div className={style.containerItemsToTravel}>
      <div className={style.contentItemsInclude}>
        <h3>Que incluye?</h3>
        {includedItems.map((item, index) => (
          <div key={index} className={style.itemInclude}>
            <HugeiconsIcon icon={CheckmarkCircle02Icon} color="#13C79E" />
            <span>{item.item}</span>
          </div>
        ))}
      </div>
      <div className={style.contentItemsExclude}>
        <h3>Que NO incluye?</h3>
        {excludedItems.map((item, index) => (
          <div key={index} className={style.itemExclude}>
            <HugeiconsIcon icon={CancelCircleIcon} color="#DE4343" />
            <span>{item.item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
