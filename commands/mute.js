const Bot = require('../assets/Bot.js')
const muteSchema = require('../assets/models/mute.js')
const ms = require('ms')

const mute = require('../assets/scripts/mute.js')

async function commandFormat(interaction, args, member, shouldExpire) {
	const currentlyMuted = await muteSchema.find({
		current: true,
		userID: args.user
	})

	if (currentlyMuted.length) {
		mute.remove(args, member) // Set old mutes current to false

		let embed = new Bot.Discord.MessageEmbed()
			.setTitle('Mute [OFF]')
			.setDescription(`Un-Muted <@${args.user}>`)
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setThumbnail(member.user.displayAvatarURL())
			.setFooter(
				interaction.member.user.tag,
				interaction.member.user.displayAvatarURL()
			)
			.setColor('#00ff00')
			.setTimestamp()

		return interaction.reply({ embeds: [embed] })
	}

	mute.new(args, interaction, member, shouldExpire)

	let embed = new Bot.Discord.MessageEmbed()
		.setTitle('Mute [ON]')
		.setDescription(`Muted <@${args.user}>`)
		.setColor('#ff0000')
		.setAuthor(member.user.tag, member.user.displayAvatarURL())
		.setThumbnail(member.user.displayAvatarURL())
		.setFooter(
			interaction.member.user.tag,
			interaction.member.user.displayAvatarURL()
		)
		.setTimestamp()

	if (args.reason) embed.addField('Reason', args.reason, true)
	if (shouldExpire) embed.addField('Time', args.time, true)

	return interaction.reply({ embeds: [embed] })
}

module.exports = {
	name: 'mute',
	description: 'A command to mute guild members.',
	syntax: '/mute <!member> <?reason> <?time>',
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
			required: false,
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

		console.log(
			`V -> Moderation -> Toggled Mute -> ${interaction.member.id} -> ${args.user}`
		)

		if (!args.time) commandFormat(interaction, args, member, false)
		else if (!ms(args.time))
			return interaction.reply({
				content: 'Please input a valid time.',
				ephemeral: true
			})
		else commandFormat(interaction, args, member, true)
	}
}
