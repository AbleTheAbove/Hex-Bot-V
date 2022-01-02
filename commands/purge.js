module.exports = {
	name: 'purge',
	description: 'A command to purge messages in a channel.',
	permissions: ['MANAGE_MESSAGES'],
	syntax: '/purge <?amount>',

	options: [
		{
			name: 'amount',
			type: 'INTEGER',
			description: 'How many messages to delete.',
			required: false
		}
	],

	run: async (interaction, args) => {
		let channel = interaction.channel

		if (args)
			if (args.amount < 1 || args.amount > 100)
				return interaction.reply({
					content:
						'Please input an amount greater than 0 and 100 or below.',
					ephemeral: true
				})

		if (!args)
			channel.bulkDelete(100, true).then(() =>
				interaction.reply({
					content: 'Purged 100 messages',
					ephemeral: true
				})
			)
		else
			channel.bulkDelete(args.amount, true).then(() =>
				interaction.reply({
					content: `Purged ${args.amount.toString()} message${
						args.amount > 1 ? 's' : ''
					}`,
					ephemeral: true
				})
			)
	}
}
