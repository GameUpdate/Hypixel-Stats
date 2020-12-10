const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "skip",
        aliases: ['s'],
        desc: "Skip the current song",
        usage: [`s`]
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
        message.react('👌')
        return client.player.skip(message)
    }
}