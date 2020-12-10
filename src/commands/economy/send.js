
module.exports = {
    config: {
        name: "send",
        aliases: ['pay'],
        desc: "Send someone some of your balance money",
        usage: [`send <user> <amount>`]
    },
    run: async (server, message, args) => {

        args[0] ? await message.guild.members.fetch({ query: args[0], limit: 1 }) : ''
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.get(args[0]) : ''
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        const amount = args[1];
        if (!amount) return message.channel.send(`Invalid amount of winners given`)
        if (isNaN(amount) || amount < 0 || amount > profile.eco.bal) return message.channel.send(`Invalid number or more than what you have in your balance`)

        let them = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        profile.eco.bal -= amount
        them.eco.bal += amount
        profile.save().then(() => {
            them.save().then(() => {
                return message.channel.send(`You have sent <:Money:759044714853957652>**${amount.toLocaleString()}** to ${user.username}`)
            })
        })
    }
}