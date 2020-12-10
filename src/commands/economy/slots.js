const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = {
    config: {
        name: "slots",
        desc: "Play slots, chances to win are low but rewards are massive!! Get extra cash on wins by buying more gems",
        usage: [`slots <amount>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const emotes = ["💰", "💰", "🍉", "🍎", "🍒", "🍓", "🍊", "🍍", "🍋", "🍊", "🍐", "🍏"];
        var bboard = [];
        let winpos = [
            [0, 4, 8],
            [2, 4, 6],
            [3, 4, 5],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ]

        const board = stripIndents`
            0 | 1 | 2
            3 | 4 | 5
            6 | 7 | 8`

        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        if (!args[0]) return message.channel.send(`Welcome to slots, you win 7x with matching fruits on diagonals, vertical and horizontal lines.\nWin the jackpot (15x) with matching money bags\nUse \`${server.bot_prefix}slots <amount>\` to start playing`)
        if (isNaN(parseInt(args[0])) || parseInt(args[0]) <= 0) return message.channel.send(`Please give an actual number that's over 0 you retard`)
        if (parseInt(args[0]) > profile.eco.bal) return message.channel.send(`That's more than what you currently have`)
        let pf = new MessageEmbed()
            .setColor(color)

        for (let i = 0; i < 9; i++) {
            bboard.push(emotes[Math.floor(Math.random() * emotes.length)])
        }
        pf.setDescription(board.replace(/\d/g, match => bboard[match]))
        let msg = await message.channel.send(pf)

        let i = 0
        while (i != 5) {
            bboard = []
            for (let i = 0; i < 9; i++) {
                bboard.push(emotes[Math.floor(Math.random() * emotes.length)])
            }
            pf.setDescription(board.replace(/\d/g, match => bboard[match]))
            msg.edit(pf)
            i++
            await sleep(500)
        }

        for (const pos of winpos) {
            let number = 0;
            let firstEmoji
            const index = winpos.indexOf(pos);

            for (const subPos of pos) {
                if (!firstEmoji) firstEmoji = board[subPos];
                else if (firstEmoji == board[subPos]) number++;
            }

            if (index == 2 && firstEmoji == "" && number == 2) {
                profile.eco.bal += Math.round((parseInt(args[0]) * 15) + (profile.eco.gems * 0.15))
                profile.eco.bal_changes.push(profile.eco.bal)
                profile.eco.save().then(() => {
                    return message.channel.send(`JACKPOT! You won <:Money:759044714853957652>**${Math.round((parseInt(args[0]) * 15) + (profile.eco.gems * 0.15)).toLocaleString()}**`);
                })
            } else if (number == 2) {
                profile.eco.bal += Math.round((parseInt(args[0]) * 7) + (profile.eco.gems * 0.15))
                profile.eco.bal_changes.push(profile.eco.bal)
                profile.eco.save().then(() => {
                    return message.channel.send(`You won <:Money:759044714853957652>**${Math.round((parseInt(args[0]) * 7) + (profile.eco.gems * 0.15)).toLocaleString()}**`);
                })
            }

        }
        profile.eco.bal -= parseInt(args[0])
        profile.eco.bal_changes.push(profile.eco.bal)
        profile.save().then(() => {
            return message.channel.send(`You lost <:Money:759044714853957652>**${parseInt(args[0]).toLocaleString()}**`);
        })
    }
}
