const Bot = require('./assets/Bot.js')
const CommandHandler = require('./handlers/command/Handler.js')

Bot.Client.once('ready', () => {
    console.log('V -> State -> Online')

    CommandHandler.Run()
})

Bot.Client.login(Bot.Config.Token)
