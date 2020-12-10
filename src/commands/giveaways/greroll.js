const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "greroll",
        aliases: [`gre`],
        desc: "Reroll a giveaway",
        usage: [`gre <message ID>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const messageID = args[0];
        if (!messageID) {
            return message.channel.send(`Invalid giveaway message ID`)
        }
        client.gaManager.reroll(messageID).then(() => {
            return message.channel.send(`Giveaway has been rerolled`)
        }).catch(() => {
            return message.channel.send(`Couldn't reroll the giveaway`)
        });
    }
}