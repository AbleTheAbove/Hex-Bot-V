module.exports = Bot => {
    Bot.Client.on('interactionCreate', interaction => {
        if (!interaction.isCommand())
            return
        else {
            let cmd = require(`../../../commands/${interaction.commandName}.js`)

            if (!cmd.permissions)
                return cmd.run(interaction)

            if (interaction.member.permissions.has(cmd.permissions))
                return cmd.run(interaction)
            else
                interaction.reply("You don't have permission to do that!")
        }
    })
}
