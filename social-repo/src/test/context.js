const {randomBytes}=require('crypto')
const format = require('pg-format')
const {default: migrate}=require('node-pg-migrate')
const pool = require('../pool')

const DEFAULT_OPTS = {
  host:'localhost',
  port:5432,
  database: 'socialnetwork_test',
  user:'westongray',
  password:process.env.DATABASE_PASSWORD
}

//Place to store test parameters
class Context {
  static async build(){
      //Randomly generating a role name to connect to pg as
    const roleName = 'a' + randomBytes(4).toString('hex') //the 'a' makes sure we always start the username with a letter as required by postgres

    //Connect to pg as usual
    await pool.connect(DEFAULT_OPTS)
    //Create a new role
    //There is no risk of sql injection because the values do not come from the user, but we still may not want this in our code.
    // await pool.query(`
    //   create role ${roleName} with login password '${roleName}';
    // `)
    await pool.query(format(
      'create role %I with login password %L;', roleName,roleName
    ))

    //Create a schema with the same name.  Give authorization for the roleName to control the schema
    await pool.query(format(
      'create schema %I authorization %I;', roleName,roleName
    ))

    //Disconnet entirely from pg
    await pool.close()

    //Run our migrations in the new schema.  The empty log function provides an empty function that is tried to run to log out.  We don't want to see the logs right now
    await migrate({
      schema: roleName,
      direction: 'up',
      log: ()=>{},
      noLock: true,
      dir: 'migrations',
      databaseUrl:{
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork_test',
        user: roleName,
        password: roleName
      }
    })

    //Connect to pg as the newly reated role
    await pool.connect({
      host: 'localhost',
      port: 5432,
      database: 'socialnetwork_test',
      user: roleName,
      password: roleName

    })

    return new Context(roleName)
  }

  constructor(roleName){
    this.roleName = roleName
  }

  async reset(){
    //Would add other test tables also if you created them
    return pool.query(`
      DELETE FROM users;
    `)
  }

  async close(){
    //Disconnect from pg
    await pool.close()

    //Reconnect as our root user
    await pool.connect(DEFAULT_OPTS)

    //Delete the role and schema we created
    await pool.query(format(
      'DROP schema %I cascade;',this.roleName
    ))
    await pool.query(format(
      'DROP ROLE %I;',this.roleName
    ))

    //Disconnect
    await pool.close()
  }

}

module.exports = Context