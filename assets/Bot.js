const discord = require('discord.js')
const config = require('../assets/files/Config.json')
const mongoose = require('mongoose')

module.exports = {
    Discord: discord,
    Config: config,
    Mongoose: {
        Connect: () => {
            return mongoose
                .connect(config.MongoDB.Connect, {
                    useUnifiedTopology: true,
                    useNewUrlParser: true
                }).then(() => console.log('V -> Connected -> MongoDB'))
        }
    },

    Client: new discord.Client({
        intents: [
            discord.Intents.FLAGS.GUILD_MESSAGES,
            discord.Intents.FLAGS.GUILD_MEMBERS,
            discord.Intents.FLAGS.GUILDS
        ]
    })
}
