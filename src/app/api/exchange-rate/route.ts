import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const currency = req.nextUrl.searchParams.get('currency')

  if (!currency || !/^[A-Z]{3}$/.test(currency)) {
    return Response.json({ error: 'Invalid currency code' }, { status: 400 })
  }

  const res = await fetch(
    `https://open.er-api.com/v6/latest/USD`,
    { next: { revalidate: 3600 } }, // cache 1h en el servidor
  )

  if (!res.ok) {
    return Response.json({ error: 'Failed to fetch rate' }, { status: 502 })
  }

  const data = await res.json()
  return Response.json(data)
}
