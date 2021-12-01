const fs = require('fs')
const ConfigDir = './assets/files/Config.json'

module.exports = app =>
	app.post('/api/config/:setting/:value', (req, res) => {
		let { setting } = req.params
		let { value } = req.params

		let Config = JSON.parse(fs.readFileSync(ConfigDir, 'utf8'))

		if (!Config[setting])
			return res.status(404).send('Could not find that setting.')

		Config[setting] = value

		fs.writeFileSync(ConfigDir, JSON.stringify(Config))

		console.log(
			`V -> API -> Post -> Request -> Set Setting -> ${setting} -> ${value}`
		)
		res.send(`Set setting: ${setting} to ${value}`)
	})
