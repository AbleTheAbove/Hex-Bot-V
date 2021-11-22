module.exports = interaction => {
    if (interaction.options.data[0]) {
        const commandOptions = []
        let option = interaction.options.data[0]
    
        if (option.value)
            commandOptions.push(option.value)
        else if (option.type === 'SUB_COMMAND_GROUP') {
            commandOptions.push(option.name)
            option = option.options[0]
        }
    
    
        if (option.type === 'SUB_COMMAND')
            commandOptions.push(option.name)
    
        if (Array.isArray(option.options))
            option.options.forEach(subOption =>
                commandOptions.push(`${subOption.name}: ${subOption.value}`))
    
        return commandOptions.join(' ')
    } else return null
}