import { Travel } from '@/payload-types'
import { PriceDisplay } from '@/components/PriceDisplay'
import style from '../styles.module.css'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AirplaneTakeOff02Icon,
  CashbackIcon,
  CouponPercentIcon,
  Payment02Icon,
  TimeScheduleIcon,
  UserGroupIcon,
} from '@hugeicons-pro/core-stroke-rounded'

type DetailItem = {
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon']
  label: string
  value: React.ReactNode
}

interface Props extends Pick<
  Travel,
  'price' | 'days' | 'travelers' | 'travelStyle' | 'methodPayment'
> {}

const translateTravelStyle = {
  private: 'Privado',
  group: 'Grupal',
}

const translateMethodPayment = {
  cash: 'Contado',
  credit: 'Crédito',
}

export const TravelDetail = ({ price, days, travelers, travelStyle, methodPayment }: Props) => {
  const items: DetailItem[] = [
    {
      icon: CouponPercentIcon,
      label: 'Desde',
      value: (
        <div>
          {price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          })}
        </div>
      ),
    },
    { icon: TimeScheduleIcon, label: 'Duración', value: `${days} días` },
    { icon: UserGroupIcon, label: 'Viajeros', value: `${travelers}` },
    {
      icon: AirplaneTakeOff02Icon,
      label: 'Estilo de viaje',
      value: translateTravelStyle[travelStyle],
    },
    { icon: Payment02Icon, label: 'Método de pago', value: translateMethodPayment[methodPayment] },
    {
      icon: CashbackIcon,
      label: 'Valor referencia',
      value: <PriceDisplay priceUSD={price} />,
    },
  ]

  return (
    <div>
      <div className={style.containerTravelDetailInfo}>
        {items.map(({ icon, label, value }) => (
          <div key={label} className={style.contentDetailInfo}>
            <div className={style.detailInfoIcon}>
              <HugeiconsIcon icon={icon} color="#264F8B" />
            </div>
            <div className={style.detailInfoText}>
              <span className={style.detailInfoTitle}>{label}</span>
              <span className={style.detailInfoDescription}>{value}</span>
            </div>
          </div>
        ))}
      </div>
      <span className={style.detailInfoDisclaimer}>
        El valor dado para esta aventura se muestra en Dólares, adicional a esto se incluye una
        referencia en moneda local. Esto no quiere decir que sea el valor real final ya que solo es
        una referencia y puede variar*
      </span>
    </div>
  )
}
