const ticketSchema = require('../assets/models/ticket.js')

const createTicket = require('../assets/scripts/createTicket.js')
const closeTicket = require('../assets/scripts/closeTicket.js')

const Bot = require('../assets/Bot.js')

module.exports = {
	name: 'ticket',
	description: 'A ticket management command.',
	syntax: '/ticket open <!type>\n/ticket close [Manage Messages]',

	options: [
		{
			name: 'open',
			type: 'SUB_COMMAND',
			description: 'Open a ticket.',
			options: [
				{
					name: 'type',
					description: 'Type of ticket to open.',
					type: 'STRING',
					required: true,
					choices: [
						{ name: 'In Game', value: 'true' },
						{ name: 'Interview', value: 'false' }
					]
				}
			]
		},
		{
			name: 'close',
			type: 'SUB_COMMAND',
			description: 'Close a ticket.',
			options: [
				{
					name: 'ticket',
					type: 'CHANNEL',
					required: true,
					description: 'Which ticket to close.'
				}
			]
		}
	],

	run: async (interaction, types) => {
		const type = types.open ? 'open' : types.close ? 'close' : null

		let args = types[type]

		switch (type) {
			case 'open':
				args.type = args.type === 'true' ? true : false

				if (
					await ticketSchema.findOne({
						open: true,
						userID: interaction.member.id
					})
				)
					return interaction.reply({
						content:
							'You already have a ticket open, wait for a staff member to close it.',
						ephemeral: true
					})

				await createTicket(interaction.member.id, args.type)

				return interaction.reply({
					content: 'Ticket has been created.',
					ephemeral: true
				})
			case 'close':
				if (
					!(
						await (
							await Bot.Client.guilds.fetch(Bot.Config.Guild)
						).members.fetch(interaction.member.id)
					).permissions.has('MANAGE_MESSAGES')
				)
					return interaction.reply({
						content: `You don't have permission to do that!`,
						ephemeral: true
					})
				if (
					!(await ticketSchema.findOne({
						channelID: args.ticket
					}))
				)
					return interaction.reply({
						content: `That's not a ticket!`,
						ephemeral: true
					})

				await closeTicket(args.ticket)

				return interaction.reply({
					content: 'Ticket has been deleted.',
					ephemeral: true
				})
		}
	}
}
