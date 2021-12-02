const Bot = require('../assets/Bot.js')
const toggleMute = require('../assets/scripts/toggleMute.js')
const muteSchema = require('../assets/models/mute.js')

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
			name: 'reason',
			required: true,
			description: 'The reason why the user was muted.'
		},
		{
			type: 'STRING',
			name: 'time',
			required: false,
			description: 'How much time to mute the user for.'
		}
	],

	run: async (interaction, args) => {
		let guild = Bot.Client.guilds.cache.get(Bot.Config.Guild)

		let member = guild.members.cache.get(args.user)

		if (!args.time) {
			console.log(
				`V -> Moderation -> Toggled Mute -> ${interaction.member.id} -> ${args.user}`
			)

			toggleMute(member)

			const currentlyMuted = await muteSchema.find({
				current: true,
				userID: args.user
			})

			if (currentlyMuted.length) {
				await muteSchema.updateMany(
					{
						userID: args.user,
						current: true
					},
					{
						$set: {
							current: false
						}
					}
				)

				let embed = new Bot.Discord.MessageEmbed()
					.setTitle('Mute [OFF]')
					.addField('User', `<@${args.user}>`)
					.addField('Staff', `<@${interaction.member.id}>`)
					.setColor('#00ff00')

				return interaction.reply({ embeds: [embed] })
			}

			const mute = new muteSchema({
				_id: Bot.MongoDB.Mongoose.Types.ObjectId(),
				expires: null,
				current: true,
				userID: args.user,
				staffID: interaction.member.id,
				reason: args.reason
			})

			mute.save()

			let embed = new Bot.Discord.MessageEmbed()
				.setTitle('Mute [ON]')
				.addField('User', `<@${args.user}>`)
				.addField('Staff', `<@${interaction.member.id}>`)
				.setColor('#ff0000')

			return interaction.reply({ embeds: [embed] })
		}
	}
}
