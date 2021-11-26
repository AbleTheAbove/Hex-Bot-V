const express = require('express')
const Bot = require('../assets/Bot.js')
const fs = require('fs')

const ConfigDir = './assets/files/Config.json'

const app = express()

app.get('/api/config', (req, res) => {
	res.send(Bot.Config)
})

app.post('/api/config/:setting/:value', (req, res) => {
	let { setting } = req.params
	let { value } = req.params

	if (!Bot.Config[setting])
		return res.status(404).send('Could not find that setting.')

	let Config = JSON.parse(fs.readFileSync(ConfigDir, 'utf8'))

	Config[setting] = value

	fs.writeFileSync(ConfigDir, JSON.stringify(Config))

	console.log(
		`V -> API -> Post -> Request -> Set Setting -> ${setting} -> ${value}`
	)
	res.send(`Set setting: ${setting} to ${value}`)
})

PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`V -> Listening -> Port -> ${PORT}`))
