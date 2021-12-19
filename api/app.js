const express = require('express')
const fs = require('fs')
const cors = require('cors')

const app = express()

module.exports = {
	run: () => {
		app.use(cors())

		fs.readdir('./api/routes/', (err, files) => {
			if (err) return console.error(err)

			files.forEach(file => {
				let route = require(`./routes/${file}`)

				route(app)
			})
		})

		PORT = process.env.PORT || 3000

		app.listen(PORT, () => console.log(`V -> Listening -> Port -> ${PORT}`))
	}
}
