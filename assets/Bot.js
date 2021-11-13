const discord = require('discord.js')
const config = require('../assets/files/Config.json')

module.exports = {
    Discord: discord,
    Config: config,

    Client: new discord.Client({
        intents: [
            discord.Intents.FLAGS.GUILD_MESSAGES,
            discord.Intents.FLAGS.GUILD_MEMBERS
        ]
    })
}
