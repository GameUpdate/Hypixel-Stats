const { MessageAttachment } = require("discord.js")

module.exports = {
    config: {
        name: "msgs",
        aliases: ['messages'],
        desc: "See the amount of messages someone has",
        usage: [`msgs <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        return message.channel.send(`${user.username} has **${profile.pf.msgTotal.toLocaleString()} messages**`)
    }
}