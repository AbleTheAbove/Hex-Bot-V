const Bot = require('../assets/Bot.js')
const banSchema = require('../assets/models/ban.js')
const checkBans = require('../assets/scripts/checkBans.js')
const ms = require('ms')

async function BanFormat(interaction, args, guild, banned) {
	const user = interaction.member.user
	const target = await Bot.Client.users.fetch(args.user)

	let embed = new Bot.Discord.MessageEmbed()
		.setThumbnail(target.displayAvatarURL())
		.setAuthor(target.tag, target.displayAvatarURL())
		.setFooter(user.tag, user.displayAvatarURL())
		.setTimestamp()

	if (banned) {
		await guild.bans
			.remove(args.user)
			.then(
				console.log(
					`V -> Unbanned -> ${args.user} -> Staff ${interaction.member.id}`
				)
			)

		await banSchema.updateMany(
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

		embed
			.setTitle('Pardon')
			.setColor('#00ff00')
			.setDescription(`Pardoned <@${args.user}>`)
	} else {
		let member

		try {
			member = await guild.members.fetch(args.user)
		} catch {
			member = null
		}

		if (!member)
			return interaction.reply({
				content: 'That member is not in this server, or banned!',
				ephemeral: true
			})

		if (member.permissions.has('ADMINISTRATOR'))
			return interaction.reply({
				content: `You can't ban that person!`,
				ephemeral: true
			})

		await guild.bans
			.create(args.user)
			.then(
				console.log(
					`V -> Banned -> ${args.user} -> Staff ${interaction.member.id}`
				)
			)

		let expires = null
		if (args.time) expires = new Date(Date.now() + ms(args.time))

		const ban = new banSchema({
			_id: Bot.MongoDB.Mongoose.Types.ObjectId(),
			expires: expires,
			current: true,
			userID: args.user,
			staffID: interaction.member.id,
			reason: args.reason
		})

		await ban.save()

		checkBans(Bot)

		embed
			.setTitle('Ban')
			.setColor('#ff0000')
			.setDescription(`Banned <@${args.user}>`)
	}

	if (args.time) embed.addField('Time', args.time, true)
	if (args.reason) embed.addField('Reason', args.reason, true)

	return interaction.reply({ embeds: [embed] })
}

module.exports = {
	name: 'ban',
	description: 'A command to ban guild members.',
	syntax: '/ban <!member> <?reason> <?time>',
	permissions: ['BAN_MEMBERS'],

	options: [
		{
			type: 'USER',
			name: 'user',
			required: true,
			description: 'Which user to ban.'
		},
		{
			type: 'STRING',
			name: 'reason',
			required: false,
			description: 'The reason why the user was banned.'
		},
		{
			type: 'STRING',
			name: 'time',
			required: false,
			description: 'How much time to ban the user for.'
		}
	],

	run: async (interaction, args) => {
		let guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)

		let banned
		try {
			banned = await guild.bans.fetch(args.user)
		} catch {
			banned = null
		}

		BanFormat(interaction, args, guild, banned)
	}
}
