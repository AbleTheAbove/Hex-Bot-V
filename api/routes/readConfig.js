const fs = require('fs')
const ConfigDir = './assets/files/Config.json'

module.exports = app =>
	app.get('/api/config', (req, res) => {
		let Config = JSON.parse(fs.readFileSync(ConfigDir, 'utf8'))

		res.send(Config)
		console.log(`V -> API -> Get -> Request -> Config`)
	})
