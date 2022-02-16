
/*** modules ***/
const {
  search
} = require('yt-search')
const ytdl = require('ytdl-core')
const fs = require('fs-extra')
const crypto = require('crypto')
const path = require('path')
const NodeID3 = require('node-id3')
var {write} = require("ffmetadata");

const axios = require('axios')
const bent = require('bent')
/*** modules ***/


/*** Server ***/
const express = require('express')
const app = express()
const port = process.env.port || 8080
/*** Server ***/

/*** Functions ***/
const {
  StreamToBuffer,
  temp,
  getBuffer
} = require('./code/functions')
/*** Functions ***/

app.get('/file', async(req, res) => {
    const fileId = req.query.id

    if(fs.existsSync()) {
      res.status(200)
      .attachment(fileId)
      .send('file ID')

    } else {
      return res.send('file not found')
    }
})


app.get('/play' , async(req, res) => {
  const id = crypto.randomBytes(10).toString('hex')
  //const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let infos = await search(req.query.music)
    const {
    videoId,
    title,
    url,
    thumbnail,
    } =  infos.videos[0]


  let dl_stream = await ytdl(url, {
      filter: "audioonly",
      fmt: "mp3",
      encoderArgs: ['-af', 'bass=g=999999999']
  })
 
  let bfstream = await StreamToBuffer(dl_stream)

  var data = {
    artist: "Me",
  };
  ffmetadata.write(dl_stream, data, function(err) {
    if (err) console.error("Error writing metadata", err);
    else console.log("Data written");
  });
  await fs.writeFile(temp(id), bfstream, 'base64')
  const tags = 
  {
    title: title,
    artist: "insta: @jonaz_dev",
    album: title,
    APIC: await bent('buffer')(thumbnail),
    TRCK: "27"
  }

 
let bff = NodeID3.update(tags, bfstream)
await fs.writeFile('./edit.mp3', bff)

  let bf2 = await fs.readFileSync(temp(id))

  console.log(bf2)

    /*
let bff = NodeID3.update(tags, bf2)
await fs.writeFile(temp(id), bff, 'base64').then(() => {
  res.status(200).json({status: 200})
})

res.status(200).json({
  udl: temp(id)
})
 */


})




app.listen(port, () => {
  console.log(`app listening on ${port}`)
})