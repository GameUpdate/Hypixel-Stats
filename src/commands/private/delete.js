const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "delete",
        admin: true,
        desc: `Delete someone's private category (for example if it bugged out)`,
        usage: [`delete <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        let cat = client.channels.cache.find(c => c.type === 'category' && c.name === user.username)
        if (!cat) { profile.rooms.open = false; profile.save(); return message.channel.send(`${user.username} does not have a private category I can delete at the moment`) }

        cat.children.forEach(async c => {
            await c.delete()
        })
        await cat.delete()
        profile.rooms.open = false
        profile.save()
        return message.channel.send(`${user.username}'s private category has been deleted`)
    }
}