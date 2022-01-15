const Bot = require('../assets/Bot.js')

async function commandFormat(target, role, name, interaction) {
	const user = interaction.member.user

	let embed = new Bot.Discord.MessageEmbed()
		.setThumbnail(target.user.displayAvatarURL())
		.setAuthor(target.user.tag, target.user.displayAvatarURL())
		.setFooter(user.tag, user.displayAvatarURL())
		.setTimestamp()

	let seperator = false

	if (
		name === 'Recruit' ||
		name === 'Soldier' ||
		name === 'Elite' ||
		name === 'Captain'
	)
		seperator = true

	if (target.roles.cache.has(role)) {
		await target.roles.remove(role)
		embed.setTitle('Role [Removed]')
		embed.setColor('ff0000')
		if (seperator) await target.roles.remove(Bot.Config.Points.Seperator)
	} else {
		await target.roles.add(role)
		embed.setTitle('Role [Given]')
		embed.setColor('00ff00')
		if (seperator) await target.roles.add(Bot.Config.Points.Seperator)
	}

	embed.addField(name, name, true)

	interaction.reply({ embeds: [embed] })
}

module.exports = {
	name: 'role',
	description: 'A command to give members guild roles.',
	syntax: '/role <!user> <!role>',
	permissions: ['MANAGE_MESSAGES'],

	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'Who to give the role to.',
			required: true
		},
		{
			name: 'role',
			type: 'STRING',
			description: 'Which role to give.',
			required: true,
			choices: [
				{
					name: 'Captain',
					value: 'captain'
				},
				{
					name: 'Elite',
					value: 'elite'
				},
				{
					name: 'Soldier',
					value: 'soldier'
				},
				{
					name: 'Recruit',
					value: 'recruit'
				},
				{
					name: 'Guild Member',
					value: 'member'
				},
				{
					name: 'Ally',
					value: 'aaddlly'
				},
				{
					name: 'T | In Game',
					value: 'ingame'
				},
				{
					name: 'T | Interview',
					value: 'interview'
				}
			]
		}
	],

	run: async (interaction, args) => {
		const guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)
		const target = await guild.members.fetch(args.user)

		switch (args.role) {
			case 'captain':
				embed = await commandFormat(
					target,
					Bot.Config.Points.Captain.role,
					'Captain',
					interaction
				)
				break
			case 'elite':
				await commandFormat(
					target,
					Bot.Config.Points.Elite.role,
					'Elite',
					interaction
				)
				break
			case 'soldier':
				await commandFormat(
					target,
					Bot.Config.Points.Soldier.role,
					'Soldier',
					interaction
				)
				break
			case 'recruit':
				await commandFormat(
					target,
					Bot.Config.Points.Recruit.role,
					'Recruit',
					interaction
				)
				break
			case 'member':
				await commandFormat(
					target,
					Bot.Config.Roles.Guild_Member,
					'Guild Member',
					interaction
				)
				break
			case 'ally':
				await commandFormat(
					target,
					Bot.Config.Roles.Ally,
					'Ally',
					interaction
				)
				break
			case 'ingame':
				await commandFormat(
					target,
					Bot.Config.Roles.In_Game,
					'T | In Game',
					interaction
				)
				break
			case 'interview':
				await commandFormat(
					target,
					Bot.Config.Roles.Interview,
					'T | Interview',
					interaction
				)
				break
		}
	}
}
