
module.exports = {
    config: {
        name: "setxp",
        desc: "Set someone's xp",
        usage: [`setxp <user> <amount>`],
        owner: true,
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args[0], limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let xp = args[1];
        if (!xp) return message.channel.send(`Invalid xp given`)
        if (isNaN(xp) || xp < 0) return message.channel.send(`Invalid number`)

        let lvl = 1
        while (xp > server.leveling.nxtLevel * (Math.pow(2, lvl) - 1)) {
            lvl++
        }

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        profile.lvl.level = lvl
        profile.lvl.xp = xp
        profile.save().then(() => {
            return message.channel.send(`Set ${user.username}'s level to **${lvl}** and xp to **${xp.toLocaleString()}**`)
        })
    }
}