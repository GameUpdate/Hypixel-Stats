const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "avatar",
        aliases: ['av'],
        desc: "See a user's avater",
        usage: [`av <user>`],
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let pf = new MessageEmbed()
            .setTitle(user.username + "'s Avatar")
            .setURL(user.avatarURL({ dynamic: true, size: 1024 }))
            .setImage(user.avatarURL({ dynamic: true, size: 1024 }))
            .setColor(color)
        return message.channel.send(pf)
    }
}