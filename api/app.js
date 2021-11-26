const express = require('express')
const Bot = require('../assets/Bot.js')
const fs = require('fs')

const app = express()

module.exports = {
	run: () => {
		fs.readdir('./api/routes/', (err, files) => {
			if (err) return console.error(err)

			files.forEach((file) => {
				let route = require(`./routes/${file}`)

				route(app)
			})
		})

		PORT = process.env.PORT || 3000

		app.listen(PORT, () => console.log(`V -> Listening -> Port -> ${PORT}`))
	}
}
