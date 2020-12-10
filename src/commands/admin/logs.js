
module.exports = {
    config: {
        name: "logs",
        admin: true,
        desc: `Toggle and set up the logs channel for level up messages`,
        usage: [`logs`, `logs <channel>`]
    },
    run: async (server, message, args) => {
        const color = server.color

        if (!args[0]) {
            server.logs.enabled ? server.logs.enabled = false : server.logs.enabled = true
            server.save().then(() => { return message.channel.send(`Logs have been turned ${server.logs.enabled ? `**ON**` : `**OFF**`}`) })

        } else {
            if (!args[0]) return message.channel.send(`Couldn't find that channel, please use a correct one`)
            let channel = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.type === 'text' && c.name.toLowerCase().includes(args[0].toLowerCase())) || message.guild.channels.cache.find(c => c.type === 'text' && c.name.toLowerCase() === args[0].toLowerCase())
            if (!channel) return message.channel.send(`Couldn't find that channel, please use a correct one`)

            server.logs.channel = channel.id
            server.save().then(() => { return message.channel.send(`Logs channel has been set to ${channel.toString()}`) })
        }
    }
}