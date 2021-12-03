const Bot = require('./assets/Bot.js')
const CommandHandler = require('./handlers/command/Handler.js')
const API = require('./api/app.js')
const checkMutes = require('./assets/scripts/checkMutes.js')

API.run()

Bot.MongoDB.Connect()

Bot.Client.once('ready', async () => {
	console.log('V -> State -> Online')

	CommandHandler.Run()

	setInterval(() => checkMutes(Bot), 1000)
})

Bot.Client.login(Bot.Config.Token)
