const { MessageAttachment } = require("discord.js")

module.exports = {
    config: {
        name: "invites",
        aliases: ['invs'],
        desc: "Get invite stats about a user",
        usage: [`invs <user>`]
    },
    run: async (server, message, args) => {

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        const profile = await Profile.findOne({ guildID: message.guild.id, userID: message.author.id });
        return message.channel.send(`${user.username} has **${profile.inv.invites}** Invites (**${profile.inv.invitesTotal}** Total | **${profile.inv.fakes}** Fakes | **${profile.inv.left}** Left)`)
    }
}