const path = require('path')
const axios = require('axios')

const getBuffer = url => {
	return axios
		.get(url, {
			responseType: 'arraybuffer'
		})
		.then((response) => {
			return response.data
		})
		.catch('error', error => console.log(error))
}
const temp = id => {
	return path.join(__dirname, `../temp/${id}.mp3`)
}

const StreamToBuffer = async stream => {
	let buffer = Buffer.from([])
	for await (const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])
	}
	return buffer
}
const fs = require('fs-extra')

const deleteAudio = async(file, minutes) => {
	try {
		if (fs.existsSync(file)) {
			let timer = setTimeout(async () => {
				await fs.unlinkSync(file)
			}, 60000 * minutes)
		}
	} catch (err) {
		console.error(err)
	}
}

module.exports = {
	getBuffer,
	temp,
	StreamToBuffer,
	deleteAudio
}