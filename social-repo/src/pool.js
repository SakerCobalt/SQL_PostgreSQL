const pg = require('pg')

//Normally we would make a pool like this
//This makes it difficult to connect to multiple databases
// const pool = new pg.Pool({
//   host: 'localhost',
//   port: 5432
// })

// module.exports = pool

//We are doing it differently to accomodate our testing.
//we are going to create a pool and wrap it inside a class

class Pool {
  _pool = null

  //The options will allow us to tell our Pool to connect to a new database by changing the options we send it
  connect(options){
    this._pool = new pg.Pool(options)
    return this._pool.query('select 1+1;') //Basic query to test the connection to the database
  }
  
  //Disconnect from the postgres database entirely
  close(){
    return this._pool.end()
  }

  //Primary method for running a query
  //For security we add: 
  query(sql,params){
    return this._pool.query(sql, params)
  }
}

module.exports = new Pool ()