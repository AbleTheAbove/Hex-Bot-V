const Bot = require('../assets/Bot.js')
const toggleMute = require('../assets/scripts/toggleMute.js')

module.exports = {
	name: 'mute',
	description: 'A command to mute guild members.',
	syntax: '/mute <!member> <?time>',
	permissions: ['MANAGE_MEMBERS'],

	options: [
		{
			type: 'USER',
			name: 'user',
			required: true,
			description: 'Which user to mute.'
		},
		{
			type: 'STRING',
			name: 'time',
			required: false,
			description: 'How much time to mute the user for.'
		}
	],

	run: (interaction, args) => {
		let guild = Bot.Client.guilds.cache.get(Bot.Config.Guild)

		let member = guild.members.cache.get(args.user)
		console.log(member)

		if (!args.time) {
			console.log(
				`V -> Moderation -> Toggled Mute -> ${interaction.member.id} -> ${args.user}`
			)

			toggleMute(member)
		}
	}
}
