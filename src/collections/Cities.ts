import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAuthenticated } from '@/access/isAuthenticated'

export const Cities: CollectionConfig = {
  slug: 'cities',
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
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      index: true,
    },
  ],
}
