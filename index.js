
/*** modules ***/
const {
  search
} = require('yt-search')
const ytdl = require('ytdl-core')
const fs = require('fs-extra')
const crypto = require('crypto')
const NodeID3 = require('node-id3')


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
  getBuffer,
  deleteAudio
} = require('./code/functions')
/*** Functions ***/



const dir = id => {return `./temp/${id}.mp3`}

app.get('/file', async(req, res) => {
    const fileId = req.query.id
    const filename = req.query.filename

    if(fs.existsSync(dir(fileId))) {
    	res.setHeader('Content-Type', 'audio/mp3');
	    res.setHeader("Content-Disposition", 'attachment;\ filename='+filename)
      res.send(await fs.readFile(dir(fileId, 'base64')))

    } else {
      return res.send('file not found')
    }
})


app.get('/play' , async(req, res) => {
  const id = crypto.randomBytes(10).toString('hex')
  console.log('request')
  let host = req.get('host')
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

  await fs.writeFile(temp(id), bfstream, 'base64').then(async() => {
    res.status(200).json({
      status: 200,
      dl_url: `${host}/file?id=${id}&filename=${encodeURIComponent(title+'.mp3').replace('_', '')}`,
      expire: 'in 6 minutes'
    })
    await deleteAudio(temp(id), 6)
  })
  console.log(res.statusCode)
  const tags = 
  {
    title: title,
    artist: "insta: @jonaz_dev",
    album: title,
    APIC: await getBuffer(thumbnail),
    TRCK: "27"
  }

 
//let bff = NodeID3.update(tags, bfstream)
//await fs.writeFile('./edit.mp3', bff)

  //let bf2 = await fs.readFileSync(temp(id))

 // console.log(bf2)



})


app.listen(port, () => {
  console.log(`app listening on ${port}`)
})
