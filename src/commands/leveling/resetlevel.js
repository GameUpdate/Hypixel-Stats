
module.exports = {
    config: {
        name: "resetlvl",
        aliases: ['rslvl', 'rsxp'],
        desc: "Reset someone's level",
        usage: [`reslvl <user>`],
        owner: true,
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args[0], limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        profile.lvl.level = 1
        profile.lvl.xp = 0
        profile.save().then(() => {
            return message.channel.send(`${user.username}'s level has been reset`)
        })
    }
}