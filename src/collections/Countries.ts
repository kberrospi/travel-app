import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Código ISO del país (ej: CO, US, MX)',
      },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      admin: {
        description: 'Código ISO de la moneda (ej: COP, USD, MXN)',
      },
    },
  ],
}
