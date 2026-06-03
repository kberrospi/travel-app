'use client'

import { useState } from 'react'
import { Button, Input, Select, ListBox } from '@heroui/react'
import styles from './styles.module.css'

interface Country {
  key: string
  label: string
  flag: string
  dialCode: string
}

const COUNTRIES: Country[] = [
  { key: 'CO', label: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
  { key: 'MX', label: 'México', flag: '🇲🇽', dialCode: '+52' },
  { key: 'PE', label: 'Perú', flag: '🇵🇪', dialCode: '+51' },
  { key: 'AR', label: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
  { key: 'CL', label: 'Chile', flag: '🇨🇱', dialCode: '+56' },
  { key: 'BR', label: 'Brasil', flag: '🇧🇷', dialCode: '+55' },
  { key: 'VE', label: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
  { key: 'EC', label: 'Ecuador', flag: '🇪🇨', dialCode: '+593' },
  { key: 'BO', label: 'Bolivia', flag: '🇧🇴', dialCode: '+591' },
  { key: 'PY', label: 'Paraguay', flag: '🇵🇾', dialCode: '+595' },
  { key: 'UY', label: 'Uruguay', flag: '🇺🇾', dialCode: '+598' },
  { key: 'PA', label: 'Panamá', flag: '🇵🇦', dialCode: '+507' },
  { key: 'CR', label: 'Costa Rica', flag: '🇨🇷', dialCode: '+506' },
  { key: 'GT', label: 'Guatemala', flag: '🇬🇹', dialCode: '+502' },
  { key: 'CU', label: 'Cuba', flag: '🇨🇺', dialCode: '+53' },
  { key: 'US', label: 'Estados Unidos', flag: '🇺🇸', dialCode: '+1' },
  { key: 'CA', label: 'Canadá', flag: '🇨🇦', dialCode: '+1' },
  { key: 'ES', label: 'España', flag: '🇪🇸', dialCode: '+34' },
  { key: 'FR', label: 'Francia', flag: '🇫🇷', dialCode: '+33' },
  { key: 'DE', label: 'Alemania', flag: '🇩🇪', dialCode: '+49' },
  { key: 'IT', label: 'Italia', flag: '🇮🇹', dialCode: '+39' },
  { key: 'GB', label: 'Reino Unido', flag: '🇬🇧', dialCode: '+44' },
]

type FieldKey = 'nombres' | 'apellidos' | 'email' | 'telefono'

interface TravelOption {
  id: string
  title: string
}

interface Props {
  travels: TravelOption[]
}

export const ContactForm = ({ travels }: Props) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedCountry, setSelectedCountry] = useState('CO')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})

  function validate(fields: {
    nombres: string
    apellidos: string
    email: string
    phone: string
  }): Partial<Record<FieldKey, string>> {
    const errs: Partial<Record<FieldKey, string>> = {}
    if (fields.nombres.trim().length < 2) errs.nombres = 'Ingresa tu nombre (mín. 2 caracteres)'
    if (fields.apellidos.trim().length < 2)
      errs.apellidos = 'Ingresa tu apellido (mín. 2 caracteres)'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = 'Ingresa un correo válido'
    if (!/^\d{6,15}$/.test(fields.phone.replace(/\s/g, '')))
      errs.telefono = 'Ingresa un número válido (6–15 dígitos)'
    return errs
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const validationErrors = validate({
      nombres: String(formData.get('nombres') ?? ''),
      apellidos: String(formData.get('apellidos') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: phoneNumber,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setStatus('loading')

    const country = COUNTRIES.find((c) => c.key === selectedCountry)
    const dialCode = country?.dialCode ?? '+57'

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres: formData.get('nombres'),
          apellidos: formData.get('apellidos'),
          telefono: `${dialCode}${phoneNumber}`,
          email: formData.get('email'),
          ...(selectedPlan ? { travelPlan: selectedPlan } : {}),
        }),
      })
      if (!res.ok) throw new Error('error')
      setStatus('success')
      form.reset()
      setPhoneNumber('')
      setSelectedPlan('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Envíanos un mensaje</h2>
      <p className={styles.formSubtitle}>
        Uno de nuestros asesores se pondrá en contacto contigo a la brevedad.
      </p>

      <div className={styles.formFields}>
        {/* Nombre */}
        <div className={styles.formField}>
          <Input
            className={`${styles.inputForm}${errors.nombres ? ` ${styles.inputInvalid}` : ''}`}
            name="nombres"
            type="text"
            placeholder="Nombre"
            fullWidth
            onChange={() => setErrors((prev) => ({ ...prev, nombres: undefined }))}
          />
          {errors.nombres && <span className={styles.fieldError}>{errors.nombres}</span>}
        </div>

        {/* Apellido */}
        <div className={styles.formField}>
          <Input
            className={`${styles.inputForm}${errors.apellidos ? ` ${styles.inputInvalid}` : ''}`}
            name="apellidos"
            type="text"
            placeholder="Apellido"
            fullWidth
            onChange={() => setErrors((prev) => ({ ...prev, apellidos: undefined }))}
          />
          {errors.apellidos && <span className={styles.fieldError}>{errors.apellidos}</span>}
        </div>

        {/* Email */}
        <div className={styles.formField}>
          <Input
            className={`${styles.inputForm}${errors.email ? ` ${styles.inputInvalid}` : ''}`}
            name="email"
            type="email"
            placeholder="Correo electrónico"
            fullWidth
            onChange={() => setErrors((prev) => ({ ...prev, email: undefined }))}
          />
          {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
        </div>

        {/* Teléfono */}
        <div className={styles.formField}>
          <div className={styles.phoneGroup}>
            <Select
              selectedKey={selectedCountry}
              onSelectionChange={(key) => key && setSelectedCountry(String(key))}
              aria-label="Indicativo de país"
              className={styles.countrySelect}
            >
              <Select.Trigger className={styles.countryTrigger}>
                <span>
                  {(() => {
                    const c = COUNTRIES.find((c) => c.key === selectedCountry)
                    return c ? `${c.flag} ${c.dialCode}` : '🌍'
                  })()}
                </span>
                <Select.Indicator className={styles.countryIndicator} />
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={COUNTRIES} className={styles.countryListBox}>
                  {(item) => (
                    <ListBox.Item
                      key={item.key}
                      id={item.key}
                      textValue={item.flag}
                      className={styles.countryListItem}
                    >
                      <span className={styles.countryItemContent}>
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                        <span className={styles.countryDialCode}>{item.dialCode}</span>
                      </span>
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <input
              className={`${styles.phoneNumberInput}${errors.telefono ? ` ${styles.inputInvalid}` : ''}`}
              name="phoneNumber"
              type="tel"
              placeholder="Número"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value.replace(/\D/g, ''))
                setErrors((prev) => ({ ...prev, telefono: undefined }))
              }}
            />
          </div>
          {errors.telefono && <span className={styles.fieldError}>{errors.telefono}</span>}
        </div>

        {/* Plan de interés */}
        {travels.length > 0 && (
          <div className={styles.formField}>
            <select
              className={styles.planSelect}
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              aria-label="Plan de interés"
            >
              <option value="">Plan de interés (opcional)</option>
              {travels.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {status === 'success' && (
          <p className={styles.formSuccess}>¡Mensaje enviado! Te contactaremos pronto. 🎉</p>
        )}
        {status === 'error' && (
          <p className={styles.formError}>Ocurrió un error. Inténtalo de nuevo.</p>
        )}

        <Button
          type="submit"
          fullWidth
          className={styles.submitButton}
          isDisabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
        </Button>
      </div>
    </form>
  )
}
