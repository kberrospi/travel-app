import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAuthenticated } from '@/access/isAuthenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isAdmin,
    read: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
