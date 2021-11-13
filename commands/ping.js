module.exports = {
    name: 'ping',
    description: 'Ping, Pong, test command.',

    run: interaction => {
        return interaction.reply('Pong!');
    }
}
