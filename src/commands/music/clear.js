const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "clear",
        aliases: ['qc', 'cq', 'cl'],
        desc: "Clear the current queue",
        usage: [`clear`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const queue = client.player.getQueue(message);
        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`You're not in a voice channel`)
        }

        if (!queue) {
            return message.channel.send(`I'm not playing anything atm`);
        }

        message.channel.send(`Cleared the queue`);
        return client.player.clearQueue(message)
    }
}