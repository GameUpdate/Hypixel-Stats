const { MessageEmbed } = require("discord.js")
const fetch = require(`node-fetch`)

module.exports = {
    config: {
        name: "lyrics",
        aliases: ['lyr'],
        desc: "Get lyrics about the current song or any song",
        usage: [`lyr`, `lyr <song name>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            const queue = client.player.getQueue(message);
            if (!queue) {
                return message.channel.send(`I'm not playing anything atm`);
            }

            const track = await client.player.nowPlaying(message);
            var res = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(track.title)}`)
            var lyrics = await res.json()
            if (lyrics.error) {
                return message.channel.send(`No lyrics found for \`${track.title}\``)
            };

            if (lyrics.lyrics.length >= 2048) {
                var cut = lyrics.lyrics.length - 2000
                lyrics.lyrics = lyrics.lyrics.slice(0, 0 - cut) + '\n...'
            };

            let lyricsEmbed = new MessageEmbed()
                .setTitle(`${lyrics.title} by ${lyrics.author}`)
                .setDescription(lyrics.lyrics)
                .setURL(lyrics.links.genius)
                .setThumbnail(lyrics.thumbnail.genius)
                .setColor(color)

            if (lyricsEmbed.description.length >= 2048)
                lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
            return message.channel.send(lyricsEmbed)

        } else {
            const track = args.join(" ")
            var res = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(track)}`)
            var lyrics = await res.json()
            if (lyrics.error) {
                return message.channel.send(`No lyrics found for \`${track.title}\``)
            };

            if (lyrics.lyrics.length >= 2048) {
                var cut = lyrics.lyrics.length - 2000
                lyrics.lyrics = lyrics.lyrics.slice(0, 0 - cut) + '\n...'
            };

            let lyricsEmbed = new MessageEmbed()
                .setTitle(`${lyrics.title} by ${lyrics.author}`)
                .setURL(lyrics.links.genius)
                .setDescription(lyrics.lyrics)
                .setThumbnail(lyrics.thumbnail.genius)
                .setColor(color)

            if (lyricsEmbed.description.length >= 2048)
                lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
            return message.channel.send(lyricsEmbed)
        }
    }
}