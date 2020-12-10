
module.exports = {
    config: {
        name: "setlevel",
        aliases: ['setlvl'],
        desc: "Set someone's level",
        usage: [`setlvl <user> <amount>`],
        owner: true,
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args[0], limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        const level = args[1];
        if (!level) return message.channel.send(`Invalid level given`)
        if (isNaN(level) || level <= 0) return message.channel.send(`Invalid number`)

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        profile.lvl.level = level
        profile.lvl.xp = server.leveling.nxtLevel * (Math.pow(2, level - 1) - 1)
        profile.save().then(() => {
            return message.channel.send(`Set ${user.username}'s level to **${level}**`)
        })
    }
}
