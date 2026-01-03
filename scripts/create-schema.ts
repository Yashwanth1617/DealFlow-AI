require('ts-node/register')

const { createSchema } = require('../lib/weaviate')

async function main() {
  await createSchema()
  console.log('✅ Schema created')
}

main().catch(console.error)
