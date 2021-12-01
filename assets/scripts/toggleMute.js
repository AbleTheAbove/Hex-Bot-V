const { MuteRole } = require('../Bot.js').Config

module.exports = member =>
	member.roles.cache.has(MuteRole)
		? member.roles.remove(MuteRole)
		: member.roles.add(MuteRole)
