module.exports = {
	Filter: async Bot => {
		Bot.Client.on('messageCreate', async message => {
			for (word of Bot.Config.Blacklist)
				if (message.content.toLowerCase().includes(word))
					await message
						.delete()
						.then(() =>
							message.channel.send(
								`<@${message.author.id}> watch yo tone.`
							)
						)
		})
	}
}
