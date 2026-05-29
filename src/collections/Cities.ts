import type { CollectionConfig } from 'payload'

export const Cities: CollectionConfig = {
  slug: 'cities',
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
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      index: true,
    },
  ],
}
