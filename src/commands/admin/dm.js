
module.exports = {
    config: {
        name: "dm",
        description: `Make the bot send a dm to a user [Only for the bot creator]`,
        usage: [`dm <user>`]
    },
    run: async (server, message, args) => {

        if (message.author.id != client.config.adminID) return message.channel.send(`Fuck off`)
        message.delete()

        args[0] ? await message.guild.members.fetch({ query: args[0], limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) return; user = user.user

        args.shift()
        return user.send(args.join(" "))
    }
}