const Bot = require('../assets/Bot.js')
const toggleMute = require('../assets/scripts/toggleMute.js')
const muteSchema = require('../assets/models/mute.js')
const ms = require('ms')

const checkMutes = require('../assets/scripts/checkMutes.js')

function newMute(args, interaction, shouldExpire) {
	let expires = null

	if (shouldExpire) expires = new Date(new Date().getTime() + ms(args.time))

	const mute = new muteSchema({
		_id: Bot.MongoDB.Mongoose.Types.ObjectId(),
		expires: expires,
		current: true,
		userID: args.user,
		staffID: interaction.member.id,
		reason: args.reason
	})

	mute.save()
}

async function oldMute(args) {
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
}

async function commandFormat(interaction, args, member, shouldExpire) {
	toggleMute(member)

	const currentlyMuted = await muteSchema.find({
		current: true,
		userID: args.user
	})

	if (currentlyMuted.length) {
		oldMute(args) // Set old mutes current to false

		let embed = new Bot.Discord.MessageEmbed()
			.setTitle('Mute [OFF]')
			.addField('User', `<@${args.user}>`)
			.addField('Staff', `<@${interaction.member.id}>`)
			.setColor('#00ff00')

		return interaction.reply({ embeds: [embed] })
	}

	newMute(args, interaction, shouldExpire)

	let embed = new Bot.Discord.MessageEmbed()
		.setTitle('Mute [ON]')
		.addField('User', `<@${args.user}>`)
		.addField('Staff', `<@${interaction.member.id}>`)
		.setColor('#ff0000')

	if (args.reason) embed.addField('Reason', args.reason)
	if (shouldExpire) embed.addField('Time', args.time)

	return interaction.reply({ embeds: [embed] })
}

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
		else commandFormat(interaction, args, member, true)

		checkMutes(Bot)
	}
}
