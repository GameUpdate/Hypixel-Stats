const { MessageEmbed } = require("discord.js")
ms = require("ms");

module.exports = {
    config: {
        name: "gadd",
        aliases: ['gcreate', 'gstart'],
        desc: "Start a new giveaway in the channel",
        usage: [`gcreate <time> <amount of winners> <prize>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const currentGiveaways = client.gaManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length;
        if (currentGiveaways > 3) {
            return message.channel.send(`You already have 3 current giveaways, you cannot get more`)
        }

        const time = args[0];
        if (!time) return message.channel.send(`Invalid time given`)
        if (isNaN(ms(time))) return message.channel.send(`Invalid time given`)
        if (ms(time) > ms("15d")) return message.channel.send(`That timeframe is too long`)

        const winnersCount = args[1];
        if (!winnersCount) return message.channel.send(`Invalid amount of winners given`)
        if (isNaN(winnersCount) || winnersCount > 10 || winnersCount < 1) return message.channel.send(`Invalid amount of winners given, choose between 1 and 10`)

        const prize = args.slice(2).join(" ");
        if (!prize) return message.channel.send(`Couldn't find a prize`)

        client.gaManager.start(message.channel, {
            time: ms(time),
            prize: prize,
            winnerCount: parseInt(winnersCount, 10),
        }).then(() => {
            return message.delete()
        });
    }
}