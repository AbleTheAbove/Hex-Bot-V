const Bot = require('./assets/Bot.js')
const CommandHandler = require('./handlers/command/Handler.js')
const API = require('./api/app.js')

API.run()

Bot.MongoDB.Connect()

Bot.Client.once('ready', async () => {
	console.log('V -> State -> Online')

	CommandHandler.Run()
})

Bot.Client.login(Bot.Config.Token)
