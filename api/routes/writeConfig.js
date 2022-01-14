const fs = require('fs')
const ConfigDir = './assets/files/Config.json'

module.exports = app =>
	app.put('/api/config', (req, res) => {
		let newConfig = req.body

		let Config = require(`../.${ConfigDir}`)

		Object.assign(Config, newConfig)

		fs.writeFileSync(ConfigDir, JSON.stringify(Config))

		console.log(`V -> API -> Post -> Request -> ${newConfig}`)
		res.send(Config)
	})
