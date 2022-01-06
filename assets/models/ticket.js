const Bot = require('../Bot.js')

const reqString = { type: String, required: true }

const ticketSchema = Bot.MongoDB.Mongoose.Schema({
	userID: reqString,
	channelID: reqString,
	open: { type: Boolean, required: true }
})

module.exports = Bot.MongoDB.Mongoose.model('Ticket', ticketSchema)
