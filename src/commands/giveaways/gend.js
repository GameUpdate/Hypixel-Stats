const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "gend",
        desc: "End a giveaway",
        usage: [`geng <message ID>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const messageID = args[0];
        if (!messageID) {
            return message.channel.send(`Invalid giveaway message ID`)
        }
        try {
            client.gaManager.edit(messageID, {
                setEndTimestamp: Date.now()
            });
            return message.channel.send(`Ended the giveaway`)
        } catch (e) {
            return message.channel.send(`Couldn't end the giveaway`)
        }
    }
}