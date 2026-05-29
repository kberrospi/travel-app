import type { CollectionConfig } from 'payload'

export const Tours: CollectionConfig = {
  slug: 'tours',
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
      name: 'city',
      type: 'text',
      required: true,
    },
  ],
}
