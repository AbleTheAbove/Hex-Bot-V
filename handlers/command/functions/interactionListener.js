const cmdLog = require('./cmdLog.js')
const optionFormatter = require('./optionFormatter.js')

module.exports = (Bot) => {
	Bot.Client.on('interactionCreate', (interaction) => {
		if (!interaction.isCommand()) return
		else {
			let cmd = require(`../../../commands/${interaction.commandName}.js`)

			if (
				interaction.member.permissions.has(cmd.permissions) ||
				!cmd.permissions
			) {
				let args = optionFormatter(interaction)

				cmdLog(Bot, interaction, cmd, args)

				return cmd.run(interaction, args)
			} else interaction.reply("You don't have permission to do that!")
		}
	})
}
