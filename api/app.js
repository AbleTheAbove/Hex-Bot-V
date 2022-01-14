const express = require('express')
const fs = require('fs')
const cors = require('cors')
const { Config } = require('../assets/Bot.js')

const app = express()

module.exports = {
	run: () => {
		app.use(cors())
		app.use('/dashboard', express.static('dashboard'))
		app.use(express.json())

		fs.readdir('./api/routes/', (err, files) => {
			if (err) return console.error(err)

			files.forEach(file => {
				let route = require(`./routes/${file}`)

				route(app)
			})
		})

		const PORT = Config.API_Port

		app.listen(PORT, () => console.log(`V -> Listening -> Port -> ${PORT}`))
	}
}
