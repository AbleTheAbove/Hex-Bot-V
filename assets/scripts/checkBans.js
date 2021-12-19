const banSchema = require('../models/ban.js')

async function expireBan(Bot, ban, guild) {
	console.log(`V -> Moderation -> Ban -> Expired -> ${ban.userID}`)

	await banSchema.updateOne(
		{ _id: ban._id },
		{
			$set: { current: false }
		}
	)

	let banned

	try {
		banned = await guild.bans.fetch(ban.userID)
	} catch {
		banned = null
	}

	if (banned) guild.bans.remove(ban.userID)
}

module.exports = async Bot => {
	let bans = await banSchema.find({ current: true })

	const guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)

	for (ban of bans) {
		if (ban.expires === null) continue

		let now = Date.now()

		if (ban.expires.getTime() <= now) expireBan(Bot, ban, guild)
		else
			setTimeout(
				() => expireBan(Bot, ban, guild),
				ban.expires.getTime() - now
			)
	}

	console.log('V -> Checked -> Bans')
}
