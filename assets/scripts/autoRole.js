const pointsSchema = require('../models/points.js')

const Bot = require('../Bot.js')
const { Points } = Bot.Config

async function removeOldRoles(member) {
	await Object.entries(Points)
		.filter(arr => (arr[1] !== Points.Seperator ? true : false))
		.map(arr => arr[1])
		.forEach(async obj => await member.roles.remove(obj.role))
}

module.exports = async user => {
	let points = await pointsSchema.findOne({ userID: user })

	if (!points) return new pointsSchema({ userID: user, points: 0 }).save()

	let x = points.amount

	let member = await (
		await Bot.Client.guilds.fetch(Bot.Config.Guild)
	).members.fetch(user)

	if (x >= Points.Soldier.req) {
		await removeOldRoles(member).then(
			async () => await member.roles.add(Points.Soldier.role)
		)
	} else if (x >= Points.Recruit.req) {
		await removeOldRoles(member).then(
			async () => await member.roles.add(Points.Recruit.role)
		)
	} else {
		await member.roles.remove(Points.Seperator)

		await removeOldRoles(member)
	}

	if (x >= Points.Recruit.req) await member.roles.add(Points.Seperator)
}
