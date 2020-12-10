const { MessageEmbed } = require("discord.js")
Pagination = require("discord-paginationembed");
const moment = require('moment')

module.exports = {
    config: {
        name: "emotes",
        aliases: ['em', 'emoji', 'emote', 'emojis'],
        desc: "List all the emotes in the server",
        usage: [`em`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            return message.channel.send(`Emotes command, use \`${server.bot_prefix}emotes list\`, \`${server.bot_prefix}emotes info <name>\` to see all the roles on this server or information about a specific one`)
        } else if (args[0].toLowerCase() === 'list' || args[0].toLowerCase() === 'l') {
            const emotes = message.guild.emojis.cache.array();
            if (!emotes[0]) return message.channel.send(`No emotes to this server could be found`)
            const filtered = emotes.sort(function (a, b) {
                return b.position - a.position
            })

            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`Emotes in ${message.guild.name}`)

            FieldsEmbed.setArray(filtered)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (e) => `${e} • ${e.id}`)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        } else if (args[0].toLowerCase() === 'info' || args[0].toLowerCase() === 'i') {
            args.shift()
            if (!args[0]) return message.channel.send("Did you even give me an emote to get info on?")
            let emoji = client.emojis.cache.find(e => e.name.toLowerCase().includes(args.join(" ").toLowerCase())) || client.emojis.cache.get(args[0].substring(args[0].length - 19, args[0].length - 1)) || client.emojis.cache.get(args[0]) || message.guild.emojis.cache.find(e => e.name.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.emojis.cache.get(args[0])
            if (!emoji) return message.channel.send("Couldn't find that emote")

            const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' })
            const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(new Date(emoji.createdTimestamp))

            let auth = emoji.author ? emoji.author : 'Unknown'
            let page = new MessageEmbed()
                .setThumbnail(emoji.url)
                .setDescription(`\n**Name:** ${emoji.name}\n**ID:** ${emoji.id}\n**Server:** ${emoji.guild.name}\n**Server ID:** ${emoji.guild.id}\n**Added by:** ${auth}\n**Added on:** ${day}/${month}/${year} \`(${(moment(new Date(emoji.createdTimestamp)).fromNow())})\``)
                .setColor(color)
            return message.channel.send(page)
        }
    }
}