const Bot = require('../assets/Bot.js')

module.exports = {
	name: 'kick',
	description: 'A command to kick members from the server.',
	syntax: '/kick <!user> <?reason>',
	permissions: ['KICK_MEMBERS'],

	options: [
		{
			name: 'user',
			description: 'The user to kick.',
			required: true,
			type: 'USER'
		},
		{
			name: 'reason',
			description: 'The reason for the kick.',
			required: false,
			type: 'STRING'
		}
	],

	run: async (interaction, args) => {
		let guild = await Bot.Client.guilds.fetch(Bot.Config.Guild)
		let member = await guild.members.fetch(args.user)
		let user = interaction.member.user

		if (member.permissions.has('ADMINISTRATOR'))
			return interaction.reply({
				content: `You can't kick that member (They're an admin!).`,
				ephemeral: true
			})

		await member.kick(args.reason)

		let embed = new Bot.Discord.MessageEmbed()
			.setTitle('Kick')
			.setDescription(`Kicked <@${args.user}>`)
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL())
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setThumbnail(member.user.displayAvatarURL())
			.setColor('#ff0000')

		if (args.reason) embed.addField('Reason', args.reason, true)

		return interaction.reply({ embeds: [embed] })
	}
}
