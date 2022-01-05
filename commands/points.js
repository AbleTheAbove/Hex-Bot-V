const Bot = require('../assets/Bot.js')

const pointsSchema = require('../assets/models/points.js')

const autoRole = require('../assets/scripts/autoRole.js')

async function getPoints(user) {
	let points = await pointsSchema.findOne({ userID: user })

	if (points) return points.amount
	else {
		let schema = new pointsSchema({
			userID: user,
			amount: 0
		})

		await schema.save()

		return 0
	}
}

async function checkPerms(user) {
	const guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)

	let member = await guild.members.fetch(user)

	if (member.permissions.has('MANAGE_MEMBERS')) return true
	else return false
}

module.exports = {
	name: 'points',
	description: 'A command to manage the points system.',
	syntax: '/points get <!user>\n/points set <!user> <!amount> [Manage Members]\n/points add <!user> <!amount> [Manage Members]\n/points sub <!user> <!amount> [Manage Members]',

	options: [
		{
			name: 'get',
			type: 'SUB_COMMAND',
			description: `Get a user's points.`,
			options: [
				{
					name: 'user',
					type: 'USER',
					description: 'The user to get the points of.',
					required: true
				}
			]
		},
		{
			name: 'sub',
			type: 'SUB_COMMAND',
			description: `Subtract from a user's points`,
			options: [
				{
					name: 'user',
					type: 'USER',
					description: 'The user to subtract the points from.',
					required: true
				},
				{
					name: 'amount',
					type: 'INTEGER',
					description: 'How many points to subtract.',
					required: true
				}
			]
		},
		{
			name: 'add',
			type: 'SUB_COMMAND',
			description: `Add to a user's points`,
			options: [
				{
					name: 'user',
					type: 'USER',
					description: 'The user to add the points to.',
					required: true
				},
				{
					name: 'amount',
					type: 'INTEGER',
					description: 'How many points to add.',
					required: true
				}
			]
		},
		{
			name: 'set',
			type: 'SUB_COMMAND',
			description: `Set a user's points`,
			options: [
				{
					name: 'user',
					type: 'USER',
					description: 'The user to set the points of.',
					required: true
				},
				{
					name: 'amount',
					type: 'INTEGER',
					description: 'How many points the user will have.',
					required: true
				}
			]
		}
	],

	run: async (interaction, types) => {
		const type = types.get
			? 'get'
			: types.sub
			? 'sub'
			: types.add
			? 'add'
			: types.set
			? 'set'
			: null

		let args, target, user, embed, points

		switch (type) {
			case 'get':
				args = types.get

				target = await Bot.Client.users.fetch(args.user)
				user = interaction.member.user

				embed = new Bot.Discord.MessageEmbed()
					.setTitle('Points')
					.setThumbnail(target.displayAvatarURL())
					.setAuthor(target.tag, target.displayAvatarURL())
					.setFooter(user.tag, user.displayAvatarURL())
					.setTimestamp()
					.addField(
						'Amount',
						(await getPoints(args.user)).toString(),
						true
					)
					.setColor('00ff00')

				interaction.reply({
					embeds: [embed],
					ephemeral: true
				})
				break
			case 'sub':
				if (!(await checkPerms(interaction.member.id)))
					return interaction.reply({
						content: `You don't have permission to do that!`,
						ephemeral: true
					})

				args = types.sub

				target = await Bot.Client.users.fetch(args.user)
				user = interaction.member.user

				embed = new Bot.Discord.MessageEmbed()
					.setTitle('Points')
					.setThumbnail(target.displayAvatarURL())
					.setAuthor(target.tag, target.displayAvatarURL())
					.setFooter(user.tag, user.displayAvatarURL())
					.setTimestamp()
					.addField(
						'Amount',
						`${(await getPoints(args.user)).toString()} - ${
							args.amount
						} = ${(
							(await getPoints(args.user)) - args.amount
						).toString()}`,
						true
					)
					.setColor('ff0000')

				points = await pointsSchema.findOne({ userID: args.user })

				points.amount -= args.amount

				points.save().then(async () => await autoRole(args.user))

				interaction.reply({ embeds: [embed] })
				break
			case 'add':
				if (!(await checkPerms(interaction.member.id)))
					return interaction.reply({
						content: `You don't have permission to do that!`,
						ephemeral: true
					})

				args = types.add

				target = await Bot.Client.users.fetch(args.user)
				user = interaction.member.user

				embed = new Bot.Discord.MessageEmbed()
					.setTitle('Points')
					.setThumbnail(target.displayAvatarURL())
					.setAuthor(target.tag, target.displayAvatarURL())
					.setFooter(user.tag, user.displayAvatarURL())
					.setTimestamp()
					.addField(
						'Amount',
						`${(await getPoints(args.user)).toString()} + ${
							args.amount
						} = ${(
							(await getPoints(args.user)) + args.amount
						).toString()}`,
						true
					)
					.setColor('00ff00')

				points = await pointsSchema.findOne({ userID: args.user })

				points.amount += args.amount

				points.save().then(async () => await autoRole(args.user))

				interaction.reply({ embeds: [embed] })
				break
			case 'set':
				if (!(await checkPerms(interaction.member.id)))
					return interaction.reply({
						content: `You don't have permission to do that!`,
						ephemeral: true
					})

				args = types.set

				target = await Bot.Client.users.fetch(args.user)
				user = interaction.member.user

				embed = new Bot.Discord.MessageEmbed()
					.setTitle('Points')
					.setThumbnail(target.displayAvatarURL())
					.setAuthor(target.tag, target.displayAvatarURL())
					.setFooter(user.tag, user.displayAvatarURL())
					.setTimestamp()
					.addField(
						'Amount',
						`${(await getPoints(args.user)).toString()} >> ${
							args.amount
						}`,
						true
					)
					.setColor('ffff00')

				points = await pointsSchema.findOne({ userID: args.user })

				points.amount = args.amount

				points.save().then(async () => await autoRole(args.user))

				interaction.reply({ embeds: [embed] })
				break
		}
	}
}
