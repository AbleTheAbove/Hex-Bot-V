const Bot = require('../Bot.js')

const reqString = { type: String, required: true }

const banSchema = Bot.MongoDB.Mongoose.Schema({
	_id: Bot.MongoDB.Mongoose.Schema.Types.ObjectId,
	expires: Date,
	current: {
		type: Boolean,
		required: true
	},
	userID: reqString,
	staffID: reqString,
	reason: String
})

module.exports = Bot.MongoDB.Mongoose.model('Ban', banSchema)
