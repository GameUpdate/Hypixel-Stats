const { MessageEmbed } = require("discord.js")
module.exports = {
    config: {
        name: "jump",
        aliases: ['j'],
        desc: "Jump to a song in the queue",
        usage: [`j <song number>`]
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

        if (!args[0] || isNaN(parseInt(args[0])) || parseInt(args[0]) <= 0 || parseInt(args[0]) > queue.tracks.length) return message.channel.send(`Couldn't find that song, try a number between **1** and **${queue.tracks.length}**`)
        for (i = 1; i < parseInt(args[0]); i++) {
            await client.player.remove(message, queue.tracks[1])
        }
        
        return client.player.skip(message)
    }
}