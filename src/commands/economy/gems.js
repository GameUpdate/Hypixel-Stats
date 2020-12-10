
module.exports = {
    config: {
        name: "gems",
        desc: "Buy gems; you can check the current price of gems for you and buy some to gain more money from games. You can also check how much money they get you per win",
        usage: [`gems`, `gems buy <amount>`, `gems worth`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        var gems = profile.eco.gems
        var price = (gems * 0.5) * 100
        var total = 0
        if (!args[0]) {
            return message.channel.send(`Gems give you more money when you win games\nThe more gems you have the more they cost!\n\nPrice per 💎 for ${message.author.username}:\n<:Money:759044714853957652>**${price.toLocaleString()}** `)
        } else if (args[0].toLowerCase() === 'buy') {
            if (!args[1] || isNaN(parseInt(args[1])) || parseInt(args[1]) <= 0) return message.channel.send(`Please give an actual number that's over 0 honey`)
            if (parseInt(args[1]) > profile.eco.bal) return message.channel.send(`That's more than what you currently have`)

            for (i = 0; i < parseInt(args[1]); i++) {
                total += price; gems++; i++; price = (gems * 0.5) * 100
            }
            profile.eco.gems = gems
            profile.eco.bal -= total
            profile.save().then(() => {
                return message.channel.send(`You just bought 💎**${parseInt(args[1])}** for <:Money:759044714853957652>**${total.toLocaleString()}**`)
            })
        } else if (args[0].toLowerCase() === 'worth') {
            return message.channel.send(`You get an extra <:Money:759044714853957652>**${Math.round(profile.eco.bal * (profile.eco.gems * 0.15)).toLocaleString()}** per win for your 💎**${profile.eco.bal.toLocaleString()}**`)
        }
    }
}