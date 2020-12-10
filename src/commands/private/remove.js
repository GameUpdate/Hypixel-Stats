const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "remove",
        desc: `Remove someone to your private category`,
        usage: [`remove <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (message.member.voice.channel.parent.name != message.author.username) return message.channel.send(`To remove people from your private channel you need to use this command in your private category`)
        if (!args[0]) return message.channel.send("Give another user not yourself or no one dumbass")

        await message.guild.members.fetch({ query: args.join(" "), limit: 1 })
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user
        if (user.id === client.user.id) return message.channel.send("Can't remove me dumbass")

        if (!message.channel.parent.permissionOverwrites.get(user.id)) return message.channel.send(`${user.username} isn't added to the private category`)
        message.channel.parent.permissionOverwrites.get(user.id).delete()
        message.guild.member(user).voice.channelID === message.member.voice.channelID ? message.guild.member(user).voice.kick() : ""
        return message.channel.send(`${user} has been removed from the private category`)
    }
}