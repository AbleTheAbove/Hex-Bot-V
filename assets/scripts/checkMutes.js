const muteSchema = require('../models/mute.js')

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
		if (mute.expires === null) continue

		let member = await guild.members.fetch(mute.userID)
		let now = Date.now()

		if (mute.expires.getTime() <= now) {
			member.roles.remove(Bot.Config.MuteRole)

			console.log(`V -> Moderation -> Mute -> Expired -> ${mute.userID}`)

			setCurrent(mute)
		} else
			setTimeout(() => {
				member.roles.remove(Bot.Config.MuteRole)

				console.log(
					`V -> Moderation -> Mute -> Expired -> ${mute.userID}`
				)

				setCurrent(mute)
			}, mute.expires.getTime() - now)
	}
	console.log('V -> Checked -> Mutes')
}
