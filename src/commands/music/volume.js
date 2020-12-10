const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "volume",
        aliases: ['vol', 'v'],
        desc: "Change the volume",
        usage: [`v <amount>`]
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
        if (!args[0] || isNaN(parseInt(args[0])) || parseInt(args[0]) < 10 || parseInt(args[0]) > 200) return message.channel.send(`Current volume level: ${queue.volume}%\nPlease use a correct number to change the volume to`)

        message.channel.send(`Volume set to **${args[0]}%**`)
        return client.player.setVolume(message, args[0]);
    }
}