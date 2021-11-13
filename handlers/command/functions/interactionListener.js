module.exports = Bot => {
    Bot.Client.on('interactionCreate', interaction => {
        if (!interaction.isCommand())
            return
        else
            require(`../../../commands/${interaction.commandName}.js`).run(interaction)
    })
}
