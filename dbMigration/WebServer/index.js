const express = require('express')
const pg = require('pg')

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'socialnetwork',
  user:'westongray',
  password:process.env.DATABASE_PASSWORD
})

// pool.query('select 1+1;').then((res)=> console.log(res))

const app = express()
app.use(express.urlencoded({extended:true}))

app.get('/posts', async (req,res)=>{
  const {rows} = await pool.query(`
    select * from posts;
  `)

  // console.log(rows)

  res.send(`
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>lng</th>
          <th>lat</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(row=>{
          return `
            <tr>
              <td>${row.id}</td>
              <td>${row.loc.x}</td>
              <td>${row.loc.y}</td>
            </tr>
          `
        }).join('')}
      </tbody>
    </table>
    <form method="POST">
        <h3>Create Post</h3>
        <div>
          <label>Lng</label>
          <input name="lng" />
        </div>
        <div>
          <label>Lat</label>
          <input name="lat" />
        </div>
        <button type="submit">Create</button>
      </form>
  `)
})

app.post('/posts', async (req,res)=>{
  const {lng, lat} = req.body

  await pool.query('insert into posts (loc) values ($1);',
  [`(${lng},${lat})`]) //The point type in sql is (num1,num2)

  res.redirect('/posts') // redirects back over to our first route.
})

app.listen(3005, ()=>{
  console.log('listenting on port 3005.')
})