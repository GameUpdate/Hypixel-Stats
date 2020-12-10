
module.exports = {
    config: {
        name: "bank",
        desc: "Interact with the bank here; you can deposit or withdraw money from or to your balance",
        usage: [`bank dep <amount>`, `bank with <amount>`]
    },
    run: async (server, message, args) => {
        let prefix = server.bot_prefix

        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        if (!args[0] || !['deposit', 'd', 'dep', 'withdraw', 'w', 'with'].includes(args[0].toLowerCase())) return message.channel.send(`Wrong usage, use \`${prefix}bank deposit\` or \`${prefix}bank withdraw\`\nUse \`${prefix}bal\` to see how much money you have`)

        if (['deposit', 'd', 'dep'].includes(args[0].toLowerCase())) {
            if (args[1] && args[1].toLowerCase() === 'all') {
                let all = profile.eco.bal

                profile.eco.bal -= all
                profile.eco.bank += all
                profile.save().then(() => {
                    return message.channel.send(`You deposited <:Money:759044714853957652>**${all.toLocaleString()}** to your bank account`)
                })
            } else if (args[1] && args[1].toLowerCase() === 'half') {
                let half = Math.round(profile.eco.bal / 2)

                profile.eco.bal -= half
                profile.eco.bank += half
                profile.save().then(() => {
                    return message.channel.send(`You deposited <:Money:759044714853957652>**${half.toLocaleString()}** to your bank account`)
                })
            } else {
                if (!args[1] || isNaN(parseInt(args[1])) || parseInt(args[1]) <= 0) return message.channel.send(`Please give an actual number that's over 0 you retard`)
                if (profile.eco.bal < parseInt(args[1])) return message.channel.send(`You don't have enough money to deposit that amount you dumbass`)

                profile.eco.bal -= parseInt(args[1])
                profile.eco.bank += parseInt(args[1])
                profile.save().then(() => {
                    return message.channel.send(`You deposited <:Money:759044714853957652>**${parseInt(args[1]).toLocaleString()}** to your bank account`)
                })
            }
        } else if (['withdraw', 'w', 'with'].includes(args[0].toLowerCase())) {
            if (args[1] && args[1].toLowerCase() === 'all') {
                let all = profile.eco.bank

                profile.eco.bal += all
                profile.eco.bank -= all
                profile.save().then(() => {
                    return message.channel.send(`You withdrew <:Money:759044714853957652>**${all.toLocaleString()}** from your bank account`)
                })
            } else if (args[1] && args[1].toLowerCase() === 'half') {
                let half = Math.round(profile.eco.bal / 2)

                profile.eco.bal += half
                profile.eco.bank -= half
                profile.save().then(() => {
                    return message.channel.send(`You withdrew <:Money:759044714853957652>**${half.toLocaleString()}** from your bank account`)
                })
            } else {
                if (!args[1] || isNaN(parseInt(args[1])) || parseInt(args[1]) <= 0) return message.channel.send(`Please give an actual number that's over 0 you retard`)
                if (profile.eco.bank < parseInt(args[1])) return message.channel.send(`You don't have that amount of money in your bank account to withdraw dumbass`)

                profile.eco.bal += parseInt(args[1])
                profile.eco.bank -= parseInt(args[1])
                profile.save().then(() => {
                    return message.channel.send(`You withdrew <:Money:759044714853957652>**${parseInt(args[1]).toLocaleString()}** from your bank account`)
                })
            }
        }
    }
}