
module.exports = {
    config: {
        name: "addxp",
        desc: "Add to someone's xp",
        usage: [`addxp <user> <amount>`],
        owner: true,
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args[0], limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let xp = args[1];
        if (!xp) return message.channel.send(`Invalid amount of xp given`)
        if (isNaN(xp) || xp < 0) return message.channel.send(`Invalid number`)

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        profile.lvl.xp += parseInt(xp)
        while (profile.lvl.xp > server.leveling.nxtLevel * (Math.pow(2, profile.lvl.level) - 1)) {
            profile.lvl.level++
        }

        profile.save().then(() => {
            return message.channel.send(`${user.username} now is level **${profile.lvl.level}** with **${profile.lvl.xp.toLocaleString()}** xp`)
        })
    }
}