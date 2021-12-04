const muteSchema = require('../models/mute.js')

async function expireMute(Bot, mute, member) {
	member.roles.remove(Bot.Config.MuteRole)

	console.log(`V -> Moderation -> Mute -> Expired -> ${mute.userID}`)

	await muteSchema.updateOne(
		{ _id: mute._id },
		{
			$set: { current: false }
		}
	)
}

module.exports = async Bot => {
	let mutes = await muteSchema.find({ current: true })

	let guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)
	for (let mute of mutes) {
		if (mute.expires === null) continue

		let member = await guild.members.fetch(mute.userID)
		let now = Date.now()

		if (mute.expires.getTime() <= now) expireMute(Bot, mute, member)
		else
			setTimeout(
				() => expireMute(Bot, mute, member),
				mute.expires.getTime() - now
			)
	}
	console.log('V -> Checked -> Mutes')
}
