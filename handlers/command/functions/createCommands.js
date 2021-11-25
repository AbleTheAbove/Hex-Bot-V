const fs = require('fs')

module.exports = (Commands) => {
	let dir = './commands/'

	fs.readdir(dir, (err, files) => {
		if (err) console.log(err)

		files.forEach((file) => {
			let cmd = require(`../../.${dir}${file}`)

			Commands.create({
				name: cmd.name,
				description: cmd.description,
				options: cmd.options
			})

			console.log(
				`V -> Command Handler -> Command -> ${cmd.name[0].toUpperCase()}
                ${cmd.name.slice(1)} -> State -> Online`
			)
		})
	})
}
