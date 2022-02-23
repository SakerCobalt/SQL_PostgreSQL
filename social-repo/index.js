const app = require ('./src/app')
const pool = require('./src/pool')

//Connect to database first so if there is an error there we don't start the rest of the app.
//We need to run a query to actually make the connection to the database after setting up the pool.
//The simple query from pool return a promise for the 'select 1+1;' query
pool.connect({
  host: 'localhost',
  port: 5432,
  database: 'socialnetwork',
  user:'westongray',
  password:process.env.DATABASE_PASSWORD
}).then(()=>{
  app().listen(process.env.PORT, ()=>{
    // console.log('Database running 2=',res)
    console.log('Listening on port 3005')
  })
}).catch((err)=>{
  console.error('This is a server error: ',err)
})