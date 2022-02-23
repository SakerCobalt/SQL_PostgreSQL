const pool = require('../pool')
const toCamelCase = require('./utils/toCamelCase')

class UserRepo {
  static async find() {
    const {rows} = await pool.query('select * from users;')
    //The data we care about is the result.rows

    //Change the database keys to camelCase to be consistent with JS
    

    return toCamelCase(rows)
  }

  static async findById (id) {
    //The below would allow the user to inject custom SQL code to run their own queries.  We never take user data and concatenate it directly into our queries.
    // const {rows} = await pool.query(`
    //   select * from users where id = ${id};
    // `)

    //This relies on the pg module to prepare a query and substitute in the value.  No way another query can be run from the user entered value
    const {rows}=await pool.query(`
      select * from users where id = $1;
    `, [id])

    //We only expect one result.  This returns the value, not array
    return toCamelCase(rows)[0]    
  }

  static async insert(username,bio) {
    const {rows} = await pool.query('insert into users (username,bio) values ($1,$2) returning *;',
    [username,bio])

    return toCamelCase(rows)[0]
  }

  static  async update(id,username,bio) {
    const {rows}=await pool.query(`
      update users set username = $1, bio=$2 where id=$3 returning *;
    `,[username,bio,id])

    return toCamelCase(rows)[0]
  }

  static async delete(id) {
    const {rows} = await pool.query(`
      delete from users where id = $1 returning *;
    `,[id])

    return toCamelCase(rows)[0]
  }

  static async count() {
    const {rows} = await pool.query('select count(*) from users;')
    //rows === [{count:29481}] is what the return will look like
    return parseInt(rows[0].count)
  }
}

module.exports = UserRepo
//In this method, we would use the static functions by UserRepo.insert(), etc. in the importing file