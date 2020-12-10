const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "coinflip",
        aliases: ['cf'],
        desc: "Bet money on a coinflip, gems give you an extra bit of cash if you win!",
        usage: [`cf <amount>`]
    },
    run: async (server, message, args) => {

        let res = ['Tails!', 'Heads!']
        function random() {
            return Math.floor(Math.random() * Math.floor(2));
        }

        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        if (args[0] && args[0].toLowerCase() === 'all') {
            let all = Math.round(profile.eco.bal + (profile.eco.gems * 0.15))
            switch (random()) {
                case 0:
                    profile.eco.bal += all
                    profile.eco.bal_changes.push(profile.eco.bal)
                    message.channel.send(`${res[Math.floor(Math.random() * res.length)]} You won <:Money:759044714853957652>**${all.toLocaleString()}**`)
                    break
                case 1:
                    profile.eco.bal -= all
                    profile.eco.bal_changes.push(profile.eco.bal)
                    message.channel.send(`${res[Math.floor(Math.random() * res.length)]} You lost <:Money:759044714853957652>**${all.toLocaleString()}**`)
                    break
            }
            return profile.save()
        } else if (args[0] && args[0].toLowerCase() === 'half') {
            let half = Math.round(profile.eco.bal / 2 + (profile.eco.gems * 0.15))
            switch (random()) {
                case 0:
                    profile.eco.bal += half
                    profile.eco.bal_changes.push(profile.eco.bal)
                    message.channel.send(`${res[Math.floor(Math.random() * res.length)]} You won <:Money:759044714853957652>**${half.toLocaleString()}**`)
                    break
                case 1:
                    profile.eco.bal -= half
                    profile.eco.bal_changes.push(profile.eco.bal)
                    message.channel.send(`${res[Math.floor(Math.random() * res.length)]} You lost <:Money:759044714853957652>**${half.toLocaleString()}**`)
                    break
            }
            return profile.save()
        } else {
            if (!args[0] || isNaN(parseInt(args[0])) || parseInt(args[0]) <= 0) return message.channel.send(`Please give an actual number that's over 0 you retard`)
            if (parseInt(args[0]) > profile.eco.bal) return message.channel.send(`That's more than what you currently have`)

            switch (random()) {
                case 0:
                    profile.eco.bal += Math.round(parseInt(args[0]) + (profile.eco.gems * 0.15))
                    profile.eco.bal_changes.push(profile.eco.bal)
                    message.channel.send(`${res[Math.floor(Math.random() * res.length)]} You won <:Money:759044714853957652>**${Math.round(parseInt(args[0]) + (profile.eco.gems * 0.15)).toLocaleString()}**`)
                    break
                case 1:
                    profile.eco.bal -= parseInt(args[0])
                    profile.eco.bal_changes.push(profile.eco.bal)
                    message.channel.send(`${res[Math.floor(Math.random() * res.length)]} You lost <:Money:759044714853957652>**${parseInt(args[0]).toLocaleString()}**`)
                    break
            }
            return profile.save()
        }
    }
}