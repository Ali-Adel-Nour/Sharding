const app = require ('express')()

const {Client} = require('pg')

const crypto = require('crypto')

const HashRing = require('hashring')



const hr = new HashRing()

hr.add("5432")
hr.add("5433")
hr.add("5434")

const clients = {
  "5432": new Client({
    "host": "dev-db", // Use the container name for PostgreSQL on port 5432
    "port": "5432",
    "user": "postgres",
    "password": "ali",
    "database": "postgres"
  }),
  "5433": new Client({
    "host": "dev-db", // Use the container name for PostgreSQL on port 5433
    "port": "5433",
    "user": "postgres",
    "password": "ali",
    "database": "postgres"
  }),
  "5434": new Client({
    "host": "dev-db", // Use the container name for PostgreSQL on port 5434
    "port": "5434",
    "user": "postgres",
    "password": "ali",
    "database": "postgres"
  })
};

connect()
async function connect(){
  await clients["5432"].connect()
  await clients["5433"].connect()
  await clients["5434"].connect()
}
app.get('/', (req, res) => {})


app.post('/', async(req, res) => {

  const url = req.query.url

  //consistently hash this get a port
  const hash = crypto.createHash('sha256').update(url).digest("base64")
  const urlId = hash.substring(0,5)

 const server = hr.get(urlId)

 await clients[server].query("INSERT INTO URL_TABLE (URL,URL_ID) VALUES ($1,$2)",[url,urlId])

  res.send({
    "urlId": urlId,
    "url": url,
    "server":server

  })
})

app.listen(8080,()=>{
  console.log("listening on port 3000")
})