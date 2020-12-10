const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "nowplaying",
        aliases: ['np'],
        desc: "Get information about the song currently playing",
        usage: [`roles`]
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

        const track = await client.player.nowPlaying(message);
        const embed = new MessageEmbed()
            .setTitle("Currently playing")
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setDescription(`Title: \`${track.title}\`\nDuration: \`${track.duration}\`\nDescription: \`\`\`${track.description ? (track.description.substring(0, 300) + "\n" + `and more...`) : `No description`}\`\`\``)
            .addField("\u200B", client.player.createProgressBar(message, { timecodes: true }))
            .setColor(color)

        return message.channel.send(embed);
    }
}