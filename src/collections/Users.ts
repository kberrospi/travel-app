import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { adminOrSelf } from '@/access/adminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Asesor', value: 'advisor' },
        { label: 'Usuario', value: 'user' },
      ],
      access: {
        // Solo el admin puede cambiar el rol de otros usuarios
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
