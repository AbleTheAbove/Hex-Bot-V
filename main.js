const Bot = require('./assets/Bot.js')
const CommandHandler = require('./handlers/command/Handler.js')

Bot.Client.once('ready', async () => {
    console.log('V -> State -> Online')

    Bot.MongoDB.Connect()
        .then(() => {
            try {
                CommandHandler.Run() 
            } finally {
                Bot.MongoDB.Mongoose.connection.close()
            }
        })
})

Bot.Client.login(Bot.Config.Token)
