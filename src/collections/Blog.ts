import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAuthenticated } from '@/access/isAuthenticated'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: isAdmin,
    read: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Tours', value: 'tours' },
        { label: 'Noticias', value: 'news' },
        { label: 'Destinos', value: 'destinations' },
        { label: 'Viajes', value: 'trips' },
      ],
      required: true,
    },
  ],
}
