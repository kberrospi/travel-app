import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAuthenticated } from '@/access/isAuthenticated'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: isAdmin,
    read: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
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
