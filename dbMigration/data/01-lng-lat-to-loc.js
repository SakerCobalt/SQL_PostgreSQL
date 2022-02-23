//The file is in a data directory to indicate that it is a data migration.  The 01 is to index it to make sure it is run first
// in case we have other data migrations

const pg = require('pg')

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'socialnetwork',
  user:'westongray',
  password: process.env.DATABASE_PASSWORD
})

pool.query(`
  update posts
  set loc = point(lng,lat)
  where loc is null;
`).then(()=>{
  console.log('update complete')
  pool.end()
}).catch((e)=>{
  console.error(e)
})