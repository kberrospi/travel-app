import type { CollectionConfig } from 'payload'
import type { User, Travel } from '@/payload-types'
import { isAdmin } from '@/access/isAdmin'
import { Resend } from 'resend'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'nombres',
    defaultColumns: ['nombres', 'apellidos', 'travelPlan', 'state', 'assignedAdvisor', 'updatedAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'advisor') return { assignedAdvisor: { equals: user.id } }
      return false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'advisor') return { assignedAdvisor: { equals: user.id } }
      return false
    },
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
      async ({ doc, operation, req, context }) => {
        if (operation !== 'create') return
        if (context.skipAdvisorAssignment) return

        const apiKey = process.env.RESEND_API_KEY
        const fromAddress = process.env.RESEND_FROM ?? 'noreply@europabajocosto.com'
        const companyName = 'Europa Bajo Costo'

        // 1. Buscar asesores disponibles y asignar uno aleatorio
        const { docs: advisors } = await req.payload.find({
          collection: 'users',
          where: { role: { equals: 'advisor' } },
          limit: 100,
          depth: 0,
          overrideAccess: true,
          req,
        })

        let assignedAdvisor: User | null = null
        if (advisors.length > 0) {
          assignedAdvisor = advisors[Math.floor(Math.random() * advisors.length)] as User
          await req.payload.update({
            collection: 'leads',
            id: doc.id,
            data: { assignedAdvisor: assignedAdvisor.id },
            context: { skipAdvisorAssignment: true },
            overrideAccess: true,
            req,
          })
        }

        // 2. Obtener detalles del plan de viaje si existe
        let travelPlan: Travel | null = null
        const travelPlanId =
          typeof doc.travelPlan === 'string' ? doc.travelPlan : doc.travelPlan?.id
        if (travelPlanId) {
          try {
            travelPlan = (await req.payload.findByID({
              collection: 'travel',
              id: travelPlanId,
              depth: 0,
              overrideAccess: true,
              req,
            })) as Travel
          } catch {
            // plan no encontrado, continuar
          }
        }

        if (!apiKey) return
        const resend = new Resend(apiKey)

        const travelInfo = travelPlan
          ? `
            <tr><td style="padding:6px 0;color:#585C63;"><strong>Plan:</strong></td><td style="padding:6px 0;">${travelPlan.title}</td></tr>
            <tr><td style="padding:6px 0;color:#585C63;"><strong>Precio:</strong></td><td style="padding:6px 0;">USD ${travelPlan.price.toLocaleString('es-CO')}</td></tr>
            <tr><td style="padding:6px 0;color:#585C63;"><strong>Duración:</strong></td><td style="padding:6px 0;">${travelPlan.days} días</td></tr>
            <tr><td style="padding:6px 0;color:#585C63;"><strong>Estilo:</strong></td><td style="padding:6px 0;">${travelPlan.travelStyle === 'private' ? 'Privado' : 'Grupal'}</td></tr>
          `
          : '<tr><td colspan="2" style="padding:6px 0;color:#585C63;">Sin plan específico seleccionado</td></tr>'

        // 3. Email de confirmación al cliente
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
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#585C63;"><strong>Nombre:</strong></td><td style="padding:6px 0;">${doc.nombres} ${doc.apellidos}</td></tr>
                <tr><td style="padding:6px 0;color:#585C63;"><strong>Teléfono:</strong></td><td style="padding:6px 0;">${doc.telefono ?? '—'}</td></tr>
                <tr><td style="padding:6px 0;color:#585C63;"><strong>Fecha tentativa:</strong></td><td style="padding:6px 0;">${doc.tentativeDate ? new Date(doc.tentativeDate).toLocaleDateString('es-CO') : '—'}</td></tr>
                ${travelInfo}
              </table>
              <p style="color: #585C63; font-size: 14px;">Si tienes alguna pregunta, responde a este correo y te ayudaremos.</p>
              <p style="color: #585C63; font-size: 14px;">— El equipo de <strong>${companyName}</strong></p>
            </div>
          `,
        })

        // 4. Email de notificación al asesor asignado
        if (assignedAdvisor) {
          await resend.emails.send({
            from: `${companyName} <${fromAddress}>`,
            to: assignedAdvisor.email,
            subject: `Nuevo lead asignado: ${doc.nombres} ${doc.apellidos}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A2E;">
                <h2 style="color: #002248;">Tienes un nuevo lead asignado 🎯</h2>
                <p>Se te ha asignado un nuevo cliente interesado. Comunícate lo antes posible.</p>
                <hr style="border: 1px solid #E0E0E0; margin: 24px 0;" />
                <h3 style="color: #264F8B; margin-bottom: 12px;">Datos del cliente</h3>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#585C63;width:140px;"><strong>Nombre:</strong></td><td style="padding:6px 0;">${doc.nombres} ${doc.apellidos}</td></tr>
                  <tr><td style="padding:6px 0;color:#585C63;"><strong>Email:</strong></td><td style="padding:6px 0;"><a href="mailto:${doc.email}" style="color:#006FEE;">${doc.email}</a></td></tr>
                  <tr><td style="padding:6px 0;color:#585C63;"><strong>Teléfono:</strong></td><td style="padding:6px 0;">${doc.telefono ?? '—'}</td></tr>
                  <tr><td style="padding:6px 0;color:#585C63;"><strong>Fecha tentativa:</strong></td><td style="padding:6px 0;">${doc.tentativeDate ? new Date(doc.tentativeDate).toLocaleDateString('es-CO') : '—'}</td></tr>
                </table>
                <hr style="border: 1px solid #E0E0E0; margin: 24px 0;" />
                <h3 style="color: #264F8B; margin-bottom: 12px;">Plan de interés</h3>
                <table style="width:100%;border-collapse:collapse;">
                  ${travelInfo}
                </table>
                <p style="margin-top: 24px;">
                  <a href="${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/admin/collections/leads/${doc.id}" style="background:#006FEE;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">Ver lead en el panel</a>
                </p>
                <p style="color: #585C63; font-size: 14px; margin-top: 24px;">— ${companyName}</p>
              </div>
            `,
          })
        }
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
      defaultValue: 'nuevo',
      options: [
        { label: 'En espera', value: 'nuevo' },
        { label: 'Contactado', value: 'contactado' },
        { label: 'En proceso', value: 'en_proceso' },
        { label: 'Cerrado', value: 'cerrado' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'assignedAdvisor',
      label: 'Asesor asignado',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: { equals: 'advisor' },
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        position: 'sidebar',
        description: 'Asesor asignado automáticamente al crear el lead',
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
