'use client'

import { useState } from 'react'
import style from '../styles.module.css'
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  Input,
  Label,
  Select,
  ListBox,
} from '@heroui/react'
import { today, getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@heroui/react'

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
  { key: 'CL', label: 'Chile', flag: '🇨🇱', dialCode: '+56' },
  { key: 'VE', label: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
  { key: 'PA', label: 'Panamá', flag: '🇵🇦', dialCode: '+507' },
  { key: 'US', label: 'Estados Unidos', flag: '🇺🇸', dialCode: '+1' },
]

type FieldKey = 'nombres' | 'apellidos' | 'email' | 'telefono' | 'date'

interface Props {
  travelId: string
}

export const FormTravel = ({ travelId }: Props) => {
  const minDate = today(getLocalTimeZone())
  const [date, setDate] = useState<DateValue | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedCountry, setSelectedCountry] = useState('CO')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})

  function validate(fields: {
    nombres: string
    apellidos: string
    email: string
    phone: string
    date: DateValue | null
  }): Partial<Record<FieldKey, string>> {
    const errs: Partial<Record<FieldKey, string>> = {}
    if (fields.nombres.trim().length < 2) errs.nombres = 'Ingresa tu nombre (mín. 2 caracteres)'
    if (fields.apellidos.trim().length < 2)
      errs.apellidos = 'Ingresa tu apellido (mín. 2 caracteres)'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = 'Ingresa un correo válido'
    if (!/^\d{6,15}$/.test(fields.phone.replace(/\s/g, '')))
      errs.telefono = 'Ingresa un número válido (6-15 dígitos)'
    if (!fields.date) errs.date = 'Selecciona una fecha'
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
      date,
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
          tentativeDate: date?.toString(),
          travelPlan: travelId,
        }),
      })
      if (!res.ok) throw new Error('error')
      setStatus('success')
      form.reset()
      setDate(null)
      setPhoneNumber('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className={style.formTravel} onSubmit={handleSubmit}>
      <h2 className={style.formTravelTitle}>Agenda una llamada</h2>
      <div className={style.formTravelContent}>
        {/* Fecha */}
        <div className={style.formField}>
          <DatePicker
            className={style.datePicker}
            name="date"
            minValue={minDate}
            value={date}
            onChange={(val) => {
              setDate(val)
              setErrors((prev) => ({ ...prev, date: undefined }))
            }}
          >
            <Label className={style.dateLabel}>Selecciona el dia:</Label>
            <DateField.Group fullWidth className={style.dateFieldGroup}>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator className={style.dateTriggerIndicator} />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover>
              <Calendar aria-label="Event date" minValue={minDate}>
                <Calendar.Header>
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                    <Calendar.YearPickerTriggerIndicator />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>{(d) => <Calendar.Cell date={d} />}</Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year }) => <Calendar.YearPickerCell year={year} />}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </Calendar>
            </DatePicker.Popover>
          </DatePicker>
          {errors.date && <span className={style.fieldError}>{errors.date}</span>}
        </div>

        {/* Nombre */}
        <div className={style.formField}>
          <Input
            className={`${style.InputForm}${errors.nombres ? ` ${style.inputInvalid}` : ''}`}
            name="nombres"
            type="text"
            placeholder="Nombre"
            fullWidth
            onChange={() => setErrors((prev) => ({ ...prev, nombres: undefined }))}
          />
          {errors.nombres && <span className={style.fieldError}>{errors.nombres}</span>}
        </div>

        {/* Apellido */}
        <div className={style.formField}>
          <Input
            className={`${style.InputForm}${errors.apellidos ? ` ${style.inputInvalid}` : ''}`}
            name="apellidos"
            type="text"
            placeholder="Apellido"
            fullWidth
            onChange={() => setErrors((prev) => ({ ...prev, apellidos: undefined }))}
          />
          {errors.apellidos && <span className={style.fieldError}>{errors.apellidos}</span>}
        </div>

        {/* Teléfono */}
        <div className={style.formField}>
          <div className={style.phoneGroup}>
            <Select
              selectedKey={selectedCountry}
              onSelectionChange={(key) => key && setSelectedCountry(String(key))}
              aria-label="Indicativo de país"
              className={style.countrySelect}
            >
              <Select.Trigger className={style.countryTrigger}>
                <span className={style.countryFlagDisplay}>
                  {(() => {
                    const c = COUNTRIES.find((c) => c.key === selectedCountry)
                    return c ? `${c.flag} ${c.dialCode}` : '🌍'
                  })()}
                </span>
                <Select.Indicator className={style.countryIndicator} />
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={COUNTRIES} className={style.countryListBox}>
                  {(item) => (
                    <ListBox.Item
                      key={item.key}
                      id={item.key}
                      textValue={item.flag}
                      className={style.countryListItem}
                    >
                      <span className={style.countryItemContent}>
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                        <span className={style.countryDialCode}>{item.dialCode}</span>
                      </span>
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <input
              className={`${style.phoneNumberInput}${errors.telefono ? ` ${style.inputInvalid}` : ''}`}
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
          {errors.telefono && <span className={style.fieldError}>{errors.telefono}</span>}
        </div>

        {/* Email */}
        <div className={style.formField}>
          <Input
            className={`${style.InputForm}${errors.email ? ` ${style.inputInvalid}` : ''}`}
            name="email"
            type="email"
            placeholder="Correo electrónico"
            fullWidth
            onChange={() => setErrors((prev) => ({ ...prev, email: undefined }))}
          />
          {errors.email && <span className={style.fieldError}>{errors.email}</span>}
        </div>

        {status === 'success' && (
          <p className={style.formSuccess}>¡Solicitud enviada! Revisa tu correo. 🎉</p>
        )}
        {status === 'error' && (
          <p className={style.formError}>Ocurrió un error. Inténtalo de nuevo.</p>
        )}

        <Button
          type="submit"
          fullWidth
          className={style.submitButton}
          isDisabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Enviando...' : 'Agendar llamada'}
        </Button>
      </div>
    </form>
  )
}
