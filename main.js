const Discord = require("discord.js")

const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]
});


bot.once('ready', () => console.log("V -> Online"))

bot.login('OTA4NDAwMTA1OTA2OTE3Mzc3.YY1Lhg.Ol821XHdo23jDmGi1R1lC2HGz8Y')
