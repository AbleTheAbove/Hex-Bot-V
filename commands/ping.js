module.exports = {
    name: 'ping',
    description: 'Ping, Pong, test command.',
    permissions: ['ADMINISTRATOR'],

    run: interaction => {
        return interaction.reply('Pong!');
    }
}
