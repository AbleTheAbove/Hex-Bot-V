const Bot = require('./assets/Bot.js')

const CommandHandler = require('./handlers/command/Handler.js')
const Chat = require('./handlers/filter/Chat.js')

const API = require('./api/app.js')

const checkMutes = require('./assets/scripts/checkMutes.js')
const checkBans = require('./assets/scripts/checkBans.js')
const checkWarns = require('./assets/scripts/checkWarns.js')

API.run()

Bot.MongoDB.Connect()

Bot.Client.once('ready', async () => {
	console.log('V -> State -> Online')

	CommandHandler.Run()

	await checkMutes(Bot)
	await checkBans(Bot)
	await checkWarns()

	await Chat.Filter(Bot)
})

Bot.Client.on(
	'guildMemberAdd',
	async member => await member.roles.add(Bot.Config.Roles.Interview)
)

Bot.Client.login(Bot.Config.Token)
