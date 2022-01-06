const Bot = require('../Bot.js')
const ticketSchema = require('../models/ticket.js')

module.exports = async (user, type) => {
	let guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)
	let target = await Bot.Client.users.fetch(user)
	let ticketType = type ? 'in-game' : 'interview'
	let ticketName = `${target.username}-${target.discriminator}-${ticketType}`

	await guild.channels
		.create(ticketName, {
			parent: Bot.Config.Ticket_Category,
			permissionOverwrites: [
				{
					id: Bot.Config.Staff,
					type: 'ROLE',
					allow: ['VIEW_CHANNEL']
				},
				{
					id: target.id,
					allow: ['VIEW_CHANNEL']
				},
				{
					id: guild.roles.everyone,
					deny: ['VIEW_CHANNEL']
				}
			],
			type: 'text'
		})
		.then(async channel => {
			;(
				await new ticketSchema({
					userID: target.id,
					channelID: channel.id,
					open: true
				})
			).save()

			channel.send(
				`**Please be patient, staff will be here shortly.**\n> <@&${Bot.Config.Staff}>`
			)
		})
}
