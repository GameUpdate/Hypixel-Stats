const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "add",
        desc: `Add someone to your private category`,
        usage: [`add <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (message.channel.parent.name != message.author.username) return message.channel.send(`To add people to your private channel you need to use this command in your private category`)
        if (!args[0]) return message.channel.send("Give another user not yourself or no one dumbass")

        await message.guild.members.fetch({ query: args.join(" "), limit: 1 })
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let cat = message.channel.parent
        await cat.updateOverwrite(user.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true })
        message.channel.send(`${user} has been added to the private category`)
    }
}