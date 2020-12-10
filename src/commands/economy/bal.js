
module.exports = {
    config: {
        name: "bal",
        aliases: ['balance'],
        desc: "See yours or someone else's balance",
        usage: [`bal`, `bal <user>`]
    },
    run: async (server, message, args) => {

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        message.channel.send(`${user.username} has <:Money:759044714853957652>**${profile.eco.bal.toLocaleString()}** in their balance, <:Money:759044714853957652>**${profile.eco.bank.toLocaleString()}** in the bank and 💎**${profile.eco.gems.toLocaleString()}**`)
    }
}