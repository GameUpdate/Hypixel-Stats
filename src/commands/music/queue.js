const { MessageEmbed } = require("discord.js")
Pagination = require("discord-paginationembed");

module.exports = {
    config: {
        name: "queue",
        aliases: ['q'],
        desc: "See the current music queue",
        usage: [`q`]
    },
    run: async (server, message, args) => {
        const color = server.color;
        const queue = client.player.getQueue(message);

        if (!queue) {
            return message.channel.send(`I'm not playing anything atm`);
        }

        if (queue.tracks.length === 1) {
            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle(`Queue in ${message.guild.name}`)
                .addField(`Currenty Playing:`, `[${queue.tracks[0].title}](${queue.tracks[0].url})\n*Requested by ${queue.tracks[0].requestedBy}*\n`);
            return message.channel.send(embed);
        }

        let i = 0;
        const FieldsEmbed = new Pagination.FieldsEmbed();

        FieldsEmbed.embed
            .setColor(color)
            .setTitle(`Queue in ${message.guild.name}`)
            .addField(`Currently Playing:`, `[${queue.tracks[0].title}](${queue.tracks[0].url})\n*Requested by ${queue.tracks[0].requestedBy}*\n`);

        FieldsEmbed.setArray(queue.tracks[1] ? queue.tracks.slice(1, queue.tracks.length) : [])
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(5)
            .formatField("Queue", (track) => `${++i}. [${track.title}](${track.url})\n*Requested by ${track.requestedBy}*\n`)
            .setDisabledNavigationEmojis(['delete'])
            .setPageIndicator('footer')
        FieldsEmbed.build();
    }
}