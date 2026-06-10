import { getPayload } from 'payload'
import config from '@payload-config'
import { Country } from 'country-state-city'

const PRINCIPAL_CITIES: Record<string, string[]> = {
  AD: ['Andorra la Vella'],
  AL: ['Tirana', 'Durrës', 'Shkodër'],
  AT: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz'],
  BA: ['Sarajevo', 'Mostar', 'Banja Luka'],
  BE: ['Brussels', 'Bruges', 'Ghent', 'Antwerp'],
  BG: ['Sofia', 'Plovdiv', 'Varna', 'Veliko Tarnovo'],
  BY: ['Minsk'],
  CH: ['Zurich', 'Geneva', 'Bern', 'Lucerne', 'Basel', 'Interlaken'],
  CY: ['Nicosia', 'Limassol', 'Paphos'],
  CZ: ['Prague', 'Brno', 'Český Krumlov'],
  DE: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Dresden', 'Heidelberg'],
  DK: ['Copenhagen', 'Aarhus'],
  EE: ['Tallinn', 'Tartu'],
  ES: [
    'Madrid',
    'Barcelona',
    'Seville',
    'Granada',
    'Valencia',
    'Bilbao',
    'Toledo',
    'Málaga',
    'Ibiza',
    'Palma',
  ],
  FI: ['Helsinki', 'Rovaniemi', 'Turku'],
  FR: ['Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Strasbourg', 'Cannes', 'Versailles'],
  GB: ['London', 'Edinburgh', 'Oxford', 'Cambridge', 'Manchester', 'Bath', 'York'],
  GR: ['Athens', 'Thessaloniki', 'Santorini', 'Mykonos', 'Rhodes', 'Heraklion'],
  HR: ['Zagreb', 'Dubrovnik', 'Split', 'Pula', 'Zadar'],
  HU: ['Budapest', 'Pécs', 'Debrecen'],
  IE: ['Dublin', 'Galway', 'Cork'],
  IS: ['Reykjavik', 'Akureyri'],
  IT: [
    'Rome',
    'Venice',
    'Florence',
    'Milan',
    'Naples',
    'Amalfi',
    'Pisa',
    'Bologna',
    'Cinque Terre',
  ],
  LI: ['Vaduz'],
  LT: ['Vilnius', 'Kaunas'],
  LU: ['Luxembourg'],
  LV: ['Riga'],
  MC: ['Monaco'],
  MD: ['Chișinău'],
  ME: ['Podgorica', 'Kotor', 'Budva'],
  MK: ['Skopje', 'Ohrid'],
  MT: ['Valletta', 'Mdina'],
  NL: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
  NO: ['Oslo', 'Bergen', 'Tromsø', 'Stavanger'],
  PL: ['Warsaw', 'Kraków', 'Wrocław', 'Gdańsk'],
  PT: ['Lisbon', 'Porto', 'Faro', 'Sintra'],
  RO: ['Bucharest', 'Cluj-Napoca', 'Brașov', 'Sibiu'],
  RS: ['Belgrade', 'Novi Sad'],
  RU: ['Moscow', 'Saint Petersburg'],
  SE: ['Stockholm', 'Gothenburg', 'Malmö'],
  SI: ['Ljubljana', 'Bled'],
  SK: ['Bratislava', 'Košice'],
  SM: ['San Marino'],
  TR: ['Istanbul', 'Ankara', 'Cappadocia', 'Antalya', 'Bodrum'],
  UA: ['Kyiv', 'Lviv', 'Odessa'],
  VA: ['Vatican City'],
  XK: ['Pristina'],
}

async function seed() {
  const payload = await getPayload({ config })

  const EUROPE_ISO_CODES = [
    'AD',
    'AL',
    'AT',
    'BA',
    'BE',
    'BG',
    'BY',
    'CH',
    'CY',
    'CZ',
    'DE',
    'DK',
    'EE',
    'ES',
    'FI',
    'FR',
    'GB',
    'GR',
    'HR',
    'HU',
    'IE',
    'IS',
    'IT',
    'LI',
    'LT',
    'LU',
    'LV',
    'MC',
    'MD',
    'ME',
    'MK',
    'MT',
    'NL',
    'NO',
    'PL',
    'PT',
    'RO',
    'RS',
    'RU',
    'SE',
    'SI',
    'SK',
    'SM',
    'TR',
    'UA',
    'VA',
    'XK',
  ]

  const countries = Country.getAllCountries().filter((c) => EUROPE_ISO_CODES.includes(c.isoCode))
  const totalCities = countries.reduce(
    (sum, c) => sum + (PRINCIPAL_CITIES[c.isoCode]?.length ?? 0),
    0,
  )
  console.log(
    `🌍 Seeding ${countries.length} European countries with ${totalCities} principal cities...`,
  )

  for (const country of countries) {
    const existing = await payload.find({
      collection: 'countries',
      where: { code: { equals: country.isoCode } },
      limit: 1,
    })

    let countryId: string

    if (existing.docs.length > 0) {
      countryId = existing.docs[0].id as string
      console.log(`  ⚠️  País ya existe: ${country.name}`)
    } else {
      const created = await payload.create({
        collection: 'countries',
        data: { name: country.name, code: country.isoCode, currency: country.currency ?? 'USD' },
      })
      countryId = created.id as string
      console.log(`  ✅ País creado: ${country.name}`)
    }

    const cities = PRINCIPAL_CITIES[country.isoCode] ?? []

    for (const cityName of cities) {
      const existingCity = await payload.find({
        collection: 'cities',
        where: {
          and: [{ name: { equals: cityName } }, { country: { equals: countryId } }],
        },
        limit: 1,
      })

      if (existingCity.docs.length > 0) continue

      await payload.create({
        collection: 'cities',
        data: { name: cityName, country: countryId },
      })
    }

    console.log(`     ✅ ${cities.length} ciudades procesadas para ${country.name}`)
  }

  console.log('\n✨ Seed completado!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
