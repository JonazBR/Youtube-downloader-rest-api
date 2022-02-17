const express = require('express')
const app = express()

app.get('/', async(req, res) => {
res.send('oi')
})


app.listen(process.env.port || 8080)
