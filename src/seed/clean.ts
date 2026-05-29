import { getPayload } from 'payload'
import config from '@payload-config'

async function clean() {
  const payload = await getPayload({ config })

  console.log('🧹 Limpiando base de datos...')

  const collections = ['cities', 'countries'] as const

  for (const collection of collections) {
    const { totalDocs } = await payload.find({ collection, limit: 0 })

    if (totalDocs === 0) {
      console.log(`  ⏭️  ${collection}: vacío`)
      continue
    }

    await payload.delete({
      collection,
      where: { id: { exists: true } },
    })

    console.log(`  ✅ ${collection}: ${totalDocs} registros eliminados`)
  }

  console.log('\n✨ Base de datos limpia!')
  process.exit(0)
}

clean().catch((err) => {
  console.error(err)
  process.exit(1)
})
