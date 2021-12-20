const ms = require('ms')
const { Client } = require('../assets/Bot.js')
const Bot = require('../assets/Bot.js')

const warnSchema = require('../assets/models/warn.js')

const mute = require('../assets/scripts/mute.js')

const severityText = severity =>
	severity == 1
		? 'Low'
		: severity == 2
		? 'Moderate'
		: severity == 3
		? 'Severe'
		: null

module.exports = {
	name: 'warn',
	description: 'A command to warn users.',
	permissions: 'MANAGE_MEMBERS',

	options: [
		{
			type: 'SUB_COMMAND',
			name: 'create',
			description: 'Create a warn.',
			options: [
				{
					type: 'USER',
					name: 'user',
					required: true,
					description: 'The user to warn.'
				},
				{
					type: 'STRING',
					name: 'reason',
					required: true,
					description: 'Reason for the warn.'
				},
				{
					type: 'STRING',
					name: 'severity',
					required: true,
					description: 'Severity of the warn.',
					choices: [
						{ name: 'Severe', value: '3' },
						{ name: 'Moderate', value: '2' },
						{ name: 'Low', value: '1' }
					]
				}
			]
		},
		{
			type: 'SUB_COMMAND',
			name: 'remove',
			description: 'Remove a warn.',
			options: [
				{
					type: 'STRING',
					name: 'identifier',
					required: true,
					description:
						'The identifier for the warn you wish to remove.'
				}
			]
		},
		{
			type: 'SUB_COMMAND',
			name: 'get',
			description: `Get a user's warns.`,
			options: [
				{
					type: 'USER',
					name: 'user',
					required: true,
					description: 'The user you want the warns of.'
				}
			]
		}
	],

	run: async (interaction, types) => {
		const type = types.create
			? 'create'
			: null || types.remove
			? 'remove'
			: null || types.get
			? 'get'
			: null

		const args = types[type]

		let user
		let warns

		if (args.user) {
			if (
				!(
					await Client.guilds.fetch(Bot.Config.Guild)
				).members.cache.get(args.user)
			)
				return interaction.reply({
					content: 'That member is not in the server.',
					ephemeral: true
				})

			warns = await warnSchema.find({
				current: true,
				userID: args.user
			})

			user = await Bot.Client.users.fetch(args.user)
		}

		if (type === 'create') {
			const warn = new warnSchema({
				_id: Bot.MongoDB.Mongoose.Types.ObjectId(),
				expires: new Date(Date.now() + ms('2d')),
				current: true,
				userID: args.user,
				staffID: interaction.member.id,
				severity: parseInt(args.severity),
				reason: args.reason
			})

			await warn.save()

			let guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)

			let member = guild.members.cache.get(args.user)

			let severity

			if (warns.length > 0)
				severity = warns
					.map(obj => obj.severity)
					.reduce((a, b) => a + b)

			const embeds = []

			embeds.push(
				new Bot.Discord.MessageEmbed()
					.setTitle('Warn')
					.setDescription(`Warned <@${args.user}>`)
					.setTimestamp()
					.setFooter(
						interaction.member.user.tag,
						interaction.member.user.displayAvatarURL()
					)
					.setAuthor(user.tag, user.displayAvatarURL())
					.setThumbnail(user.displayAvatarURL())
					.addField('Reason', args.reason, true)
					.addField('Severity', severityText(args.severity), true)
					.setColor('#ff0000')
			)

			function muteUser(time) {
				mute.remove(args, member)
				mute.new(
					{ user: args.user, time: time },
					interaction,
					member,
					true
				)

				embeds.push(
					new Bot.Discord.MessageEmbed()
						.setTitle('Mute')
						.setDescription(`Time: ${time}`)
						.setColor('#ff0000')
				)
			}

			if (severity <= 3 && severity > 1) muteUser('5m')
			else if (severity > 3 && severity <= 6) muteUser('15m')
			else if (severity > 6 && severity <= 9) muteUser('2h')
			else if (severity > 9) {
				member.kick()

				embeds.push(
					new Bot.Discord.MessageEmbed()
						.setTitle('Kick')
						.setDescription(`Kicked: ${user.tag}`)
						.setColor('#ff0000')
				)
			}

			console.log(
				`V -> Moderation -> Warned -> ${args.user} -> Staff -> ${interaction.member.id}`
			)

			return interaction.reply({ embeds: embeds })
		} else if (type === 'get') {
			let embeds = []

			embeds.push(
				new Bot.Discord.MessageEmbed()
					.setTitle('Warns')
					.setDescription(`For ${user.tag}`)
					.setAuthor(user.tag, user.displayAvatarURL())
					.setThumbnail(user.displayAvatarURL())
					.setColor('#ff8000')
			)

			for (warn of warns) {
				let embed = new Bot.Discord.MessageEmbed()
					.setTitle('Warn')
					.addField('Reason', warn.reason, true)
					.addField('Severity', severityText(warn.severity), true)
					.addField('Identifier', warn._id.toString(), true)
					.setFooter(
						(await Bot.Client.users.fetch(warn.staffID)).tag,
						(
							await Bot.Client.users.fetch(warn.staffID)
						).displayAvatarURL()
					)
					.setTimestamp(new Date(warn.expires.getTime() - ms('2d')))

				embed.setColor(
					warn.severity === 1
						? '#ffff00'
						: warn.severity === 2
						? '#ff8000'
						: warn.severity === 3
						? '#ff0000'
						: null
				)

				embeds.push(embed)
			}

			return interaction.reply({ embeds: embeds })
		} else if (type === 'remove') {
			let warn
			try {
				warn = await warnSchema.findOne({ _id: args.identifier })
			} catch {
				warn = null
			}

			if (!warn)
				return interaction.reply({
					content: 'Warn not found.',
					ephemeral: true
				})

			await warnSchema.updateOne(
				{ _id: args.identifier },
				{ $set: { current: false } }
			)

			user = await Bot.Client.users.fetch(warn.userID)
			let staff = await await Bot.Client.users.fetch(warn.staffID)

			console.log(
				`V -> Moderation -> Removed -> Warn -> ${warn._id} -> Staff -> ${staff.id}`
			)

			return interaction.reply({
				embeds: [
					new Bot.Discord.MessageEmbed()
						.setTitle('Warn')
						.setDescription(`Removed a warn from <@${warn.userID}>`)
						.setAuthor(user.tag, user.displayAvatarURL())
						.setFooter(staff.tag, staff.displayAvatarURL())
						.setTimestamp(
							new Date(warn.expires.getTime() - ms('2d'))
						)
						.addField('Reason', warn.reason, true)
						.addField('Severity', severityText(warn.severity), true)
						.addField('Identifier', warn._id.toString(), true)
						.setThumbnail(user.displayAvatarURL())
						.setColor('#00ff00')
				]
			})
		}
	}
}
