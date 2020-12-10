Pagination = require("discord-paginationembed");

module.exports = {
    config: {
        name: "xpreq",
        desc: "See the xp requirements for the levels ahead of you",
        usage: [`xpreq`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let xpreq = []
        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        for (i = profile.lvl.level; i < profile.lvl.level + 10; i++) {
            xpreq.push(server.leveling.nxtLevel * (Math.pow(2, i) - 1))
        }

        let l = profile.lvl.level + 1

        const FieldsEmbed = new Pagination.FieldsEmbed();
        FieldsEmbed.embed
            .setColor(color)
            .setTitle(`Your XP requirements`)
            .setDescription(`Your level: **${profile.lvl.level}** | Your XP: \`${profile.lvl.xp.toLocaleString()}\``)

        FieldsEmbed.setArray(xpreq)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(10)
            .formatField("** **", (e) => `Level **${l++}** ↦ \`${e.toLocaleString()} XP\` ↦ ${server.xprole.some(r => r.key === `${l - 1}`) ? '<@&' + server.xprole.find(r => r.key === `${l - 1}`).value + '>' : `No role`}`)
            .setDisabledNavigationEmojis(['delete'])
            .setPageIndicator('footer')
        return FieldsEmbed.build();
    }
}