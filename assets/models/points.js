const Bot = require('../Bot.js')

const pointsSchema = Bot.MongoDB.Mongoose.Schema({
	userID: { type: String, required: true },
	amount: { type: Number, required: true }
})

module.exports = Bot.MongoDB.Mongoose.model('Points', pointsSchema)
