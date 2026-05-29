import type { CollectionConfig } from 'payload'

export const TRAVEL_STYLE_OPTIONS = [
  { label: 'Privado', value: 'private' },
  { label: 'Grupal', value: 'group' },
]

export const METHOD_PAYMENT_OPTIONS = [
  { label: 'Contado', value: 'cash' },
  { label: 'Crédito', value: 'credit' },
]

export const Travel: CollectionConfig = {
  slug: 'travel',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data?.title && !data?.slug) {
          data.slug = (data.title as string)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Se auto-genera del título. Ej: trotamundos-iv',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Galería de imágenes',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price (USD)',
      required: true,
    },
    {
      name: 'days',
      type: 'number',
      required: true,
    },
    {
      name: 'travelers',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'travelStyle',
      type: 'select',
      required: true,
      options: TRAVEL_STYLE_OPTIONS,
    },
    {
      name: 'methodPayment',
      type: 'select',
      required: true,
      options: METHOD_PAYMENT_OPTIONS,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'includedItems',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'excludedItems',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'itinerary',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
