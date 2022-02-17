
const express = require("express");
const PORT = process.env.PORT || 8080 || 5000 || 3000
const app = express()


app.get('/', async (req, res) => {
	res.send('oi')
})


app.listen(PORT, function() {
	console.log(`Serve running on port ${PORT}`)
})
