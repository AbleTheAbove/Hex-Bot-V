const Bot = require('../Bot.js')

const muteSchema = require('../models/mute.js')
const ms = require('ms')

const checkMutes = require('./checkMutes.js')

module.exports = {
	new: async (args, interaction, member, shouldExpire) => {
		member.roles.add(Bot.Config.MuteRole)

		let expires = null

		if (shouldExpire) expires = new Date(Date.now() + ms(args.time))

		const mute = new muteSchema({
			_id: Bot.MongoDB.Mongoose.Types.ObjectId(),
			expires: expires,
			current: true,
			userID: args.user,
			staffID: interaction.member.id,
			reason: args.reason
		})

		await mute.save()

		checkMutes(Bot)
	},

	remove: async (args, member) => {
		member.roles.remove(Bot.Config.MuteRole)

		await muteSchema.updateMany(
			{
				userID: args.user,
				current: true
			},
			{
				$set: {
					current: false
				}
			}
		)

		checkMutes(Bot)
	}
}
