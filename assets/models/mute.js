const Bot = require('../Bot.js')

const reqString = { type: String, required: true }

const muteSchema = Bot.MongoDB.Mongoose.Schema({
	_id: Bot.MongoDB.Mongoose.Schema.Types.ObjectId,
	expires: Date,
	current: {
		type: Boolean,
		required: true
	},
	userID: reqString,
	staffID: reqString,
	reason: reqString
})

module.exports = Bot.MongoDB.Mongoose.model('Mute', muteSchema)
