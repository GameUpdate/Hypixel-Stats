
module.exports = {
    config: {
        name: "rob",
        cooldown: 172800,
        desc: "Attempt a robbery on someone's balance but if you get caught you lose money!",
        usage: [`rob <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        if (user.id === message.author.id) return message.channel.send("Can't rob yourself you idiot")

        let them = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        if (them.eco.bal < 10000) return message.channel.send(`${user.username} doesn't have enough money to get robbed`)

        let you = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        if (you.eco.bal < 10000) return message.channel.send(`You don't have enough money to rob someone`)

        var d = Math.random();
        if (d < 0.5) {
            let lost = Math.round(you.eco.bal * 0.05)
            you.eco.bal -= lost
            you.eco.robbed = true
            you.eco.robbedTimer = new Date()
            you.eco.bal_changes.push(you.eco.bal)
            you.eco.save().then(() => {
                return message.channel.send(`You fucked up the robbery and couldn't get anything\nYou lost <:Money:759044714853957652>**${lost.toLocaleString()}**`)
            })
        } else if (d < 1) {

            while (d > 0.1 || d < 0.3) {
                d = Math.random()
            }

            let money = Math.round(them.eco.bal * d)
            you.eco.bal += Math.round(money + (you.eco.eco.gems * 0.15))
            you.eco.bal_changes.push(you.eco.bal)
            them.eco.bal -= money
            them.eco.bal_changes.push(them.eco.bal)
            you.save().then(() => {
                them.save().then(() => {
                    return message.channel.send(`You robbed <:Money:759044714853957652>**${Math.round(money + (you.eco.eco.gems * 0.15)).toLocaleString()}** from ${user.username}`)
                })
            })
        }
    }
}