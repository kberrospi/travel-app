import style from './styles.module.css'

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerInner}>
        <div className={style.brand}>
          <img src="/assets/img/logo.png" alt="Europa Bajo Costo" className={style.logo} />
          <p className={style.tagline}>
            El mejor sitio para reservar viajes y que tus vacaciones sean excepcionales
          </p>
          <div className={style.social}>
            <span className={style.socialLabel}>Síguenos:</span>
            <div className={style.socialIcons}>
              <a href="#" aria-label="Facebook" className={style.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter / X" className={style.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className={style.socialLink}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className={style.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={style.contactBlock}>
          <p className={style.contactTitle}>EUROPA BAJO COSTO</p>
          <p className={style.contactSub}>Nit 901.109.972-2</p>
          <a href="tel:6017440681" className={style.phoneMain}>
            (601) 744-0681
          </a>
          <a href="tel:3054548311" className={style.phoneMobile}>
            3054548311 / 3176364025
          </a>
          <address className={style.address}>
            Carrera 15 # 88 – 21 Of. 702
            <br />
            Edificio Torre Unika Virrey
            <br />
            Bogotá
          </address>
          <a href="mailto:infoco@europabajocosto.com" className={style.email}>
            infoco@europabajocosto.com
          </a>
        </div>

        <div className={style.contactBlock}>
          <p className={style.contactTitle}>EUROPA BAJO COSTO</p>
          <p className={style.contactSub}>S.A.C. RUC 20602280722</p>
          <a href="tel:014800327" className={style.phoneMain}>
            (1) 480-0327
          </a>
          <a href="https://wa.me/51932788289" className={style.whatsapp}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.523 5.858L0 24l6.302-1.498A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.012-1.374l-.36-.213-3.741.889.944-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z" />
            </svg>
            932788289
          </a>
          <address className={style.address}>
            Schreiber Business Center
            <br />
            Germán Schreiber 276 San Isidro - Lima
          </address>
          <a href="mailto:infope@europabajocosto.com" className={style.email}>
            infope@europabajocosto.com
          </a>
        </div>

        <div className={style.linksBlock}>
          <p className={style.linksTitle}>ENLACES</p>
          <ul className={style.linksList}>
            <li>
              <a href="#">Información Legal</a>
            </li>
            <li>
              <a href="#">Noticias EBC</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Nosotros</a>
            </li>
            <li>
              <a href="#">Contáctanos</a>
            </li>
          </ul>
        </div>

        <div className={style.linksBlock}>
          <p className={style.linksTitle}>SERVICIOS</p>
          <ul className={style.linksList}>
            <li>
              <a href="#">Viaja Bajo Costo</a>
            </li>
            <li>
              <a href="#">Seguro de viaje</a>
            </li>
            <li>
              <a href="#">AirHelp</a>
            </li>
            <li>
              <a href="#">Tours</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={style.bottomBar}>
        <p>
          Copyright © 2026 <strong>Traveler</strong> . All rights reserved
        </p>
      </div>
    </footer>
  )
}
