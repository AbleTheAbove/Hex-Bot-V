const fs = require('fs')
const Bot = require('../assets/Bot.js')

function getHelpEmbed(file) {
	let cmd = require(`./${file}`)

	let permissions = cmd.permissions
		? (
				cmd.permissions
					.join(', ')
					.toLowerCase()
					.charAt(0)
					.toUpperCase() +
				cmd.permissions.join(', ').toLowerCase().slice(1)
		  ).replace('_', ' ')
		: 'None'

	let embed = new Bot.Discord.MessageEmbed()
		.setColor('#c0c0c0')
		.setTitle(cmd.name[0].toUpperCase() + cmd.name.slice(1))
		.setDescription(cmd.description)
		.addField('Syntax', cmd.syntax)
		.addField('Permissions', permissions)

	return embed
}

module.exports = {
	name: 'help',
	description: 'A command to get help on other commands.',
	syntax: '/help <?cmd>',
	options: [
		{
			name: 'cmd',
			type: 'STRING',
			description: 'Which command to send information about.',
			required: false
		}
	],

	run: (interaction, args) => {
		fs.readdir('./commands/', (err, files) => {
			if (err) return console.log(err)

			if (args) {
				let file = files.find(
					(file) => file.replace('.js', '') == args.cmd.toLowerCase()
				)

				if (file)
					return interaction.reply({ embeds: [getHelpEmbed(file)] })
				else return interaction.reply('Could not find that command.')
			}

			let embeds = []

			files.forEach((file) => embeds.push(getHelpEmbed(file)))

			return interaction.reply({ embeds: embeds })
		})
	}
}
