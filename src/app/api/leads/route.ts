import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { nombres, apellidos, email, telefono, tentativeDate, travelPlan } = body

  if (!nombres || !apellidos || !email || !telefono || !tentativeDate || !travelPlan) {
    return Response.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  // Validación básica de email
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Email inválido' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const lead = await payload.create({
    collection: 'leads',
    data: {
      nombres: String(nombres),
      apellidos: String(apellidos),
      email: String(email),
      telefono: String(telefono),
      tentativeDate: String(tentativeDate),
      travelPlan: String(travelPlan),
      state: 'contactado',
    },
    overrideAccess: true, // visitante no autenticado — intencional
    draft: false,
  })

  return Response.json({ id: lead.id }, { status: 201 })
}
