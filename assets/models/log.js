const Bot = require('../Bot.js')

const logSchema = Bot.MongoDB.Mongoose.Schema({
    _id: Bot.MongoDB.Mongoose.Schema.Types.ObjectId,
    time: String,
    type: String
})

module.exports = Bot.MongoDB.Mongoose.model('Log', logSchema)