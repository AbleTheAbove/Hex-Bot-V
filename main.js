const Bot = require('./assets/Bot.js')
const CommandHandler = require('./handlers/command/Handler.js')

Bot.Client.once('ready', async () => {
    console.log('V -> State -> Online')

    Bot.MongoDB.Connect()
        .then( () => CommandHandler.Run() )
})

Bot.Client.login(Bot.Config.Token)
