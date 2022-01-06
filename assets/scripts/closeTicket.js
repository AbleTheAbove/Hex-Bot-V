const Bot = require('../Bot.js')
const ticketSchema = require('../models/ticket.js')

module.exports = async channelID => {
	await Bot.Client.channels
		.fetch(channelID)
		.then(async channel => await channel.delete('Closed Ticket'))

	await ticketSchema.updateOne(
		{ channelID: channelID },
		{ $set: { open: false } }
	)
}
