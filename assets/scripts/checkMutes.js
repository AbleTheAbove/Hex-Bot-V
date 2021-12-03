const muteSchema = require('../models/mute.js')
const ms = require('ms')

module.exports = async Bot => {
	let mutes = await muteSchema.find({ current: true })

	let setCurrent = async mute =>
		await muteSchema.updateOne(
			{ _id: mute._id },
			{
				$set: { current: false }
			}
		)

	let guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)
	for (let mute of mutes) {
		if (mute.expires) {
			let member = await guild.members.fetch(mute.userID)

			if (mute.expires.getTime() <= new Date().getTime()) {
				member.roles.remove(Bot.Config.MuteRole)

				console.log(
					`V -> Moderation -> Mute -> Expired -> ${mute.userID}`
				)

				setCurrent(mute)
			}
		}
	}
}
