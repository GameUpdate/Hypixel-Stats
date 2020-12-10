const { MessageEmbed } = require("discord.js")
Pagination = require("discord-paginationembed");
const moment = require('moment')

module.exports = {
    config: {
        name: "roles",
        aliases: ['role', 'r'],
        desc: "List all the roles in the server",
        usage: [`roles`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            return message.channel.send(`Roles command, use \`${server.bot_prefix}roles list\` or \`${server.bot_prefix}roles info <role>\` to see all the roles on this server or information about a specific one`)
        } else if (args[0].toLowerCase() === 'list' || args[0].toLowerCase() === 'l') {
            const roles = message.guild.roles.cache.array();
            if (!roles[0]) return message.channel.send(`No roles have been found on this server`)
            const filtered = roles.sort(function (a, b) {
                return b.position - a.position
            })
            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`Members in ${message.guild.name}`)

            FieldsEmbed.setArray(filtered[0] ? filtered : [])
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (r) => `${r} • ${r.id} ↦ \`${r.members.size} Member(s)\``)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        } else if (args[0].toLowerCase() === 'info' || args[0].toLowerCase() === 'i') {
            args.shift()
            if (!args[0]) return message.channel.send("Did you even give me a role to get info on?")
            await message.guild.roles.fetch({ query: args.join(" "), limit: 1 })
            let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.roles.cache.get(args[0])
            if (!role) return message.channel.send("Couldn't find that role")

            const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' })
            const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(new Date(role.createdTimestamp))

            let page = new MessageEmbed()
                .setThumbnail(`https://dummyimage.com/65x65/${role.hexColor.substr(1)}/${role.hexColor.substr(1)}`)
                .setDescription(`**Name:** ${role}\n**ID:** ${role.id}\n**Members:** <:online:759044009900376104>\`${role.members.filter(r => r.presence.status !== 'offline').size}\` | <:offline:759044009577807893>\`${role.members.filter(r => r.presence.status === 'offline').size}\` | <:user2:750150492365127682>\`${role.members.filter(r => !r.user.bot).size}\` | <:settings1:750150492193161317>\`${role.members.filter(r => r.user.bot).size}\`\n**Created on:** ${day}/${month}/${year} \`(${(moment(new Date(role.createdTimestamp)).fromNow())})\`\n**Position:** ${message.guild.roles.cache.size - role.position}/${message.guild.roles.cache.size}\n**Hoisted:** *${role.hoist}*`)
                .setColor(color)
            return message.channel.send(page)
        }
    }
}