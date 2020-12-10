const { MessageEmbed } = require("discord.js")
module.exports = {
    config: {
        name: "loop",
        aliases: ['l'],
        desc: "Toggle the queue looping",
        usage: [`l`]
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

        queue.repeatMode ? message.channel.send(`**No longer looping** queue`) : message.channel.send(`Now **looping** queue`)
        return client.player.setRepeatMode(message, !queue.repeatMode)
    }
}