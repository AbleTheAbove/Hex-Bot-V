module.exports = {
	name: 'ping',
	description: 'Ping, Pong, test command.',
	syntax: '/ping',
	permissions: ['ADMINISTRATOR'],

	run: interaction => {
		return interaction.reply('Pong!')
	}
}
