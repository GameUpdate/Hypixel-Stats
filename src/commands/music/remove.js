const { MessageEmbed } = require("discord.js")
module.exports = {
    config: {
        name: "rem",
        desc: "Remove a song from the queue",
        usage: [`rem <song number>`]
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
        if (!args[0] || isNaN(parseInt(args[0])) || parseInt(args[0]) < 0 || parseInt(args[0]) > queue.tracks.length) return message.channel.send(`Please use a correct song number to remove`)

        message.channel.send(`Removed \`${queue.tracks[parseInt(args[0])].title}\``);
        return client.player.remove(message, queue.tracks[parseInt(args[0])])
    }
}