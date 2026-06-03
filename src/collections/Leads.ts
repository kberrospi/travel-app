import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrAdvisor } from '@/access/isAdminOrAdvisor'
import { Resend } from 'resend'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'nombres',
    defaultColumns: ['nombres', 'apellidos', 'state', 'updatedAt', 'updatedBy'],
  },
  access: {
    create: () => true, // público: el formulario del frontend crea leads sin autenticación
    read: isAdminOrAdvisor,
    update: isAdminOrAdvisor,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user) {
          data.updatedBy = req.user.id
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return

        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) return

        const resend = new Resend(apiKey)
        const fromAddress = process.env.RESEND_FROM ?? 'noreply@europabajocosto.com'
        const companyName = 'Europa Bajo Costo'

        await resend.emails.send({
          from: `${companyName} <${fromAddress}>`,
          to: doc.email,
          subject: '¡Tu solicitud fue recibida! 🌍',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A2E;">
              <h2 style="color: #002248;">¡Hola, ${doc.nombres}!</h2>
              <p>Recibimos tu solicitud de información. Uno de nuestros asesores se pondrá en contacto contigo muy pronto.</p>
              <hr style="border: 1px solid #E0E0E0; margin: 24px 0;" />
              <p><strong>Resumen de tu solicitud:</strong></p>
              <ul>
                <li><strong>Nombre:</strong> ${doc.nombres} ${doc.apellidos}</li>
                <li><strong>Teléfono:</strong> ${doc.telefono ?? '—'}</li>
                <li><strong>Fecha tentativa:</strong> ${doc.tentativeDate ? new Date(doc.tentativeDate).toLocaleDateString('es-CO') : '—'}</li>
              </ul>
              <p style="color: #585C63; font-size: 14px;">Si tienes alguna pregunta, responde a este correo y te ayudaremos.</p>
              <p style="color: #585C63; font-size: 14px;">— El equipo de <strong>${companyName}</strong></p>
            </div>
          `,
        })
      },
    ],
  },
  fields: [
    {
      name: 'nombres',
      type: 'text',
      required: true,
    },
    {
      name: 'apellidos',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'telefono',
      type: 'text',
      required: true,
    },
    {
      name: 'tentativeDate',
      type: 'date',
    },
    {
      name: 'travelPlan',
      label: 'Plan de interés',
      type: 'relationship',
      relationTo: 'travel',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'state',
      type: 'select',
      required: true,
      defaultValue: 'contactado',
      options: [
        { label: 'Contactado', value: 'contactado' },
        { label: 'En proceso', value: 'en_proceso' },
        { label: 'Cerrado', value: 'cerrado' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Último usuario que modificó este registro',
      },
    },
  ],
}
