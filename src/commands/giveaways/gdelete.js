const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "gdelete",
        aliases: ['gdel', 'grem', 'gremove'],
        desc: "Delete a giveaway",
        usage: [`gdel <message ID>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const messageID = args[0];
        if (!messageID) {
            return message.channel.send(`Invalid giveaway message ID`)
        }
        client.gaManager.delete(messageID).then(() => {
            return message.channel.send(`Deleted the giveaway`)
        }).catch(() => {
            return message.channel.send(`Couldn't delete the giveaway`)
        });
    }
}