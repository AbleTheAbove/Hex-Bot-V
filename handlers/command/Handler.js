const Bot = require('../../assets/Bot.js')

const createCommands = require('./functions/createCommands.js')
const interactionListener = require('./functions/interactionListener.js')

module.exports = {
    Run: () => {
        const Guild = Bot.Client.guilds.cache.get(Bot.Config.Guild)

        let Commands

        if (Guild)
            Commands = Guild.commands
        else
            return console.log('V -> Error -> Guild not found')

        createCommands(Commands)

        interactionListener(Bot)
    }
}
