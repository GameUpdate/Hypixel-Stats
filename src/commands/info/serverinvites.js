const { MessageEmbed } = require("discord.js")
Pagination = require("discord-paginationembed");
const moment = require('moment')

module.exports = {
    config: {
        name: "serverinvites",
        aliases: ['sinv', 'sinvites'],
        desc: "List all the invites to the server",
        usage: [`sinv`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        message.guild.fetchInvites().then(invs => {
            var invites = invs.array()
            if (!invites[0]) return message.channel.send(`No invites to this server could be found`)

            const filtered = invites.sort(function (a, b) {
                return b.uses - a.uses
            })

            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`Invite codes in ${message.guild.name}`)

            FieldsEmbed.setArray(filtered[0] ? filtered : [])
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (e) => `**${e.code}** • Made by ${e.inviter} ↦ \`${e.uses} Uses\``)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        })
    }
}