
const express = require('express')
const app = express()
const port = process.env.port || 8080


app.get('/', async(req, res) => {
res.send('sexo')
})



app.listen(port, () => {
  console.log(`app listening on ${port}`)
})
