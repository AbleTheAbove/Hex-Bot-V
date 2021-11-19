const fs = require('fs')
const Bot = require('../assets/Bot.js')

module.exports = {
    name: 'help',
    description: 'A command to get help on other commands.',

    run: interaction => {
        fs.readdir('./commands/', (err, files) => {

            if (err) return console.log(err)

            let embeds = []

            files.forEach(file => {
                let cmd = require(`./${file}`)

                let embed = new Bot.Discord.MessageEmbed()
                    .setColor('#c0c0c0')
                    .setTitle(cmd.name[0].toUpperCase() + cmd.name.slice(1))
                    .setDescription(cmd.description)
                    .addField('Syntax', `${(cmd.options) ? cmd.options : `/${cmd.name}`}`)
                    .addField('Permissions', `${(cmd.permissions) ? cmd.permissions : 'None'}`)

                embeds.push(embed)
            })

            return interaction.reply({ embeds: embeds })
        })
    }
}
