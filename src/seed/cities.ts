import { getPayload } from 'payload'
import config from '@payload-config'

// Agrega aquí las ciudades por código de país
const data: { countryCode: string; cities: string[] }[] = [
  {
    countryCode: 'CO',
    cities: ['Pereira', 'Manizales', 'Bucaramanga', 'Pasto', 'Leticia'],
  },
  {
    countryCode: 'MX',
    cities: ['Tulum', 'San Cristóbal de las Casas', 'Mérida', 'Puebla', 'Guanajuato'],
  },
  {
    countryCode: 'PE',
    cities: ['Trujillo', 'Puno', 'Huaraz', 'Chiclayo'],
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('🏙️  Seeding cities...')

  for (const { countryCode, cities } of data) {
    const countryResult = await payload.find({
      collection: 'countries',
      where: { code: { equals: countryCode } },
      limit: 1,
    })

    if (countryResult.docs.length === 0) {
      console.log(`  ❌ País no encontrado con código: ${countryCode}`)
      continue
    }

    const countryId = countryResult.docs[0].id as string
    const countryName = countryResult.docs[0].name

    console.log(`  📍 País: ${countryName}`)

    for (const cityName of cities) {
      const existing = await payload.find({
        collection: 'cities',
        where: {
          and: [{ name: { equals: cityName } }, { country: { equals: countryId } }],
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`     ⚠️  Ciudad ya existe: ${cityName}`)
        continue
      }

      await payload.create({
        collection: 'cities',
        data: { name: cityName, country: countryId },
      })
      console.log(`     ✅ Ciudad creada: ${cityName}`)
    }
  }

  console.log('\n✨ Seed de ciudades completado!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
