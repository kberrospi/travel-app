import type { Country } from '@/payload-types'
import { MENU_ITEMS } from '@/utils'
import style from './styles.module.css'
import { CountrySelector } from './CountrySelector'

interface Props {
  countries: Country[]
}

export const Sidebar = ({ countries }: Props) => {
  return (
    <nav className={style.containerSidebar}>
      <div className={style.navbar}>
        <img src="/assets/img/logo.png" alt="Logo" />
        <div className={style.menu}>
          {MENU_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <CountrySelector countries={countries} />
      </div>
    </nav>
  )
}
