const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "stop",
        aliases: ['leave', 'fuckoff', 'disconnect'],
        desc: "Kick me out the voice call",
        usage: [`leave`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`You're not in a voice channel`)
        }

        message.react('👌')
        return client.player.stop(message)
    }
}