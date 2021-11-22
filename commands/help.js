const fs = require('fs')
const Bot = require('../assets/Bot.js')

module.exports = {
    name: 'help',
    description: 'A command to get help on other commands.',
    options: [
        {
            name: 'cmd',
            type: 'STRING',
            description: 'Which command to send information about.',
            required: false
        }
    ],

    run: interaction => {
        fs.readdir('./commands/', (err, files) => {

            if (err) return console.log(err)

            let embeds = []

            files.forEach(file => {
                let cmd = require(`./${file}`)

                let permissions = (cmd.permissions) ? 
                    ((cmd.permissions.join(', ').toLowerCase()).charAt(0).toUpperCase() +
                    (cmd.permissions.join(', ').toLowerCase()).slice(1)).replace('_', ' ') :
                    'None'

                let embed = new Bot.Discord.MessageEmbed()
                    .setColor('#c0c0c0')
                    .setTitle(cmd.name[0].toUpperCase() + cmd.name.slice(1))
                    .setDescription(cmd.description)
                    .addField('Syntax', `${(cmd.options) ? cmd.options : `/${cmd.name}`}`)
                    .addField('Permissions', permissions)

                embeds.push(embed)
            })

            return interaction.reply({ embeds: embeds })
        })
    }
}
