const warnSchema = require('../models/warn.js')

async function expireWarn(warn) {
	console.log(`V -> Moderation -> Warn -> Expired -> ${warn.userID}`)

	await warnSchema.updateOne(
		{ _id: mute._id },
		{
			$set: { current: false }
		}
	)
}

module.exports = async () => {
	console.log('V -> Checked -> Warns')

	const warns = await warnSchema.find({ current: true })

	for (warn of warns)
		if (warn.expires.getTime() <= Date.now()) expireWarn(warn)
		else
			setTimeout(
				() => expireWarn(warn),
				warn.expires.getTime() - Date.now()
			)
}
