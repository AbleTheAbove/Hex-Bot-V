module.exports = (interaction) => {
	if (!interaction.options.data[0]) return null

	let args = {}

	for (option of interaction.options.data)
		if (option.type === 'SUB_COMMAND') {
			args[option.name] = {}
			option.options.forEach((subOption) => {
				args[option.name][subOption.name] = subOption.value
			})
		} else if (option.type === 'SUB_COMMAND_GROUP') {
			args[option.name] = {}
			option.options.forEach((subOption) => {
				args[option.name][subOption.name] = {}
				subOption.options.forEach((dSubOption) => {
					args[option.name][subOption.name][dSubOption.name] =
						dSubOption.value
				})
			})
		} else args[option.name] = option.value

	return args
}
