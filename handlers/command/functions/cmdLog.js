const Log = require('../../../assets/models/log.js')
const moment = require('moment')

function toEST(time) {
	return 'EST: ' + moment(time).utcOffset(-300).format('YYYY-MM-DD h:mm a')
}

module.exports = (Bot, interaction, cmd, args) => {
	let TS = new Date()

	const log = new Log({
		_id: Bot.MongoDB.Mongoose.Types.ObjectId(),
		time: toEST(TS),
		type: 'Slash Command',
		info: {
			authorID: interaction.member,
			interactionID: interaction,
			commandName: cmd.name,
			arguments: args
		}
	})

	log.save().catch(err => console.error(err))

	return console.log(
		`V -> Mongoose -> Log -> Slash Command -> ${
			cmd.name[0].toUpperCase() + cmd.name.slice(1)
		} -> User -> ${interaction.member.id}`
	)
}
