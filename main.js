const Bot = require('./assets/Bot.js')
const CommandHandler = require('./handlers/command/Handler.js')
const API = require('./api/app.js')

const checkMutes = require('./assets/scripts/checkMutes.js')
const checkBans = require('./assets/scripts/checkBans.js')
const checkWarns = require('./assets/scripts/checkWarns.js')

API.run()

Bot.MongoDB.Connect()

Bot.Client.once('ready', async () => {
	console.log('V -> State -> Online')

	CommandHandler.Run()

	checkMutes(Bot)
	checkBans(Bot)
	checkWarns()
})

Bot.Client.login(Bot.Config.Token)
