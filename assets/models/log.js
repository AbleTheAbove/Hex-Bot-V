const Bot = require('../Bot.js')

const reqString = { type: String, required: true }

const logSchema = Bot.MongoDB.Mongoose.Schema({
	_id: Bot.MongoDB.Mongoose.Schema.Types.ObjectId,
	time: reqString,
	type: reqString,
	info: {
		type: Object,
		required: true
	}
})

module.exports = Bot.MongoDB.Mongoose.model('Log', logSchema)
