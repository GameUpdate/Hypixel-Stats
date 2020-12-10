const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "shuffle",
        desc: "Shuffle the current queue",
        usage: [`shuffle`]
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
        message.channel.send(`Queue shuffled`);
        client.player.shuffle(message);
    }
}