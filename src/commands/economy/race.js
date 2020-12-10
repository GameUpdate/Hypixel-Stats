const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "race",
        desc: "Bet on a horse to win the race",
        usage: [`race`, `race <color>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        function run() {
            return (Math.floor(Math.random() * Math.floor(4)) + 3)
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr;
        };

        var Red = 0; var Green = 0; var Yellow = 0; var Blue = 0; var Purple = 0
        let race1 = ['<:red_horse:727458123077648416>', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '🏁']
        let race2 = ['<:green_horse:727458481753423962>', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '🏁']
        let race3 = ['<:yellow_horse:727459665671094293>', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '🏁']
        let race4 = ['<:blue_horse:727458476372262932>', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '🏁']
        let race5 = ['<:purple_horse:727459808218841178>', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '━', '🏁']
        let noperms = new MessageEmbed()
            .setDescription(`${race1.join('')}\n\n${race2.join('')}\n\n${race3.join('')}\n\n${race4.join('')}\n\n${race5.join('')}`)
            .setColor(color)

        if (!args[0]) {
            message.channel.send(noperms)
            return message.channel.send(`Bet on a horse to win the race!\nUse \`${server.bot_prefix}race <red | green | yellow | blue | purple> <amount>\``)
        } else {

            if (!args[0] || !['red', 'green', 'yellow', 'blue', 'purple'].includes(args[0].toLowerCase())) return message.channel.send(`Wrong color; use \`red\`, \`green\`, \`yellow\`, \`blue\` or \`purple\``)

            let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
            if (!args[1] || isNaN(parseInt(args[1])) || parseInt(args[1]) <= 0) return message.channel.send(`Please give an actual number that's over 0 you retard`)
            if (parseInt(args[1]) > profile.eco.bal) return message.channel.send(`That's more than what you currently have`)
            let m = await message.channel.send(noperms)

            loop1:
            while (Red < 25 | Green < 25 | Yellow < 25 | Blue < 25 | Purple < 25) {

                oRed = Red; oGreen = Green; oYellow = Yellow; oBlue = Blue; oPurple = Purple
                Red = Red + run(); Green = Green + run(); Yellow = Yellow + run(); Blue = Blue + run(); Purple = Purple + run()
                Nred_pos = array_move(race1, oRed, Red); Ngreen_pos = array_move(race2, oGreen, Green); Nyellow_pos = array_move(race3, oYellow, Yellow); Nblue_pos = array_move(race4, oBlue, Blue); Npurple_pos = array_move(race5, oPurple, Purple);
                racer = new MessageEmbed()

                racer.setDescription(`${race1.join('')}\n\n${race2.join('')}\n\n${race3.join('')}\n\n${race4.join('')}\n\n${race5.join('')}`)
                racer.setColor(color)
                m.edit(racer)

                red_pos = Nred_pos; green_pos = Ngreen_pos; yellow_pos = Nyellow_pos; blue_pos = Nblue_pos; purple_pos = Npurple_pos
                switch (true) {
                    case (Red >= 25):
                        var won = 'red'
                        message.channel.send('The Red horse won the race!')
                        break loop1
                    case (Green >= 25):
                        var won = 'green'
                        message.channel.send('The Green horse won the race!')
                        break loop1
                    case (Yellow >= 25):
                        var won = 'yellow'
                        message.channel.send('The Yellow horse won the race!')
                        break loop1
                    case (Blue >= 25):
                        var won = 'blue'
                        message.channel.send('The Blue horse won the race!')
                        break loop1
                    case (Purple >= 25):
                        var won = 'purple'
                        message.channel.send('The Purple horse won the race!')
                        break loop1
                }
                await sleep(500)
            }

            const bet = parseInt(args[1])
            if (won.includes(args[0].toLowerCase())) {
                message.channel.send(`You won <:Money:759044714853957652>**${Math.round(bet * 5 + (profile.eco.gems * 0.15)).toLocaleString()}**`)
                profile.eco.bal += Math.round(bet * 5 + (profile.eco.gems * 0.15))
                profile.save().then(() => {
                    return m.edit(racer)
                })
            } else {
                message.channel.send(`You lost <:Money:759044714853957652>**${bet.toLocaleString()}**`)
                profile.eco.bal -= bet
                profile.save().then(() => {
                    return m.edit(racer)
                })
            }
        }
    }
}