Pagination = require("discord-paginationembed");

module.exports = {
    config: {
        name: "msgreq",
        desc: "See the msg requirements for the levels ahead of you",
        usage: [`msgreq`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        let l = server.msgrole.filter(m => m.key > profile.pf.msgTotal).sort(function (a, b) { return (b.key - a.key) })
        if (l.length < 1) return message.channel.send(`You don't have any roles left to get from messages`)

        const FieldsEmbed = new Pagination.FieldsEmbed();
        FieldsEmbed.embed
            .setColor(color)
            .setTitle(`Your message requirements`)
            .setDescription(`Your messages: **${profile.pf.msgTotal.toLocaleString()}**`)

        FieldsEmbed.setArray(l)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(10)
            .formatField("** **", (e) => `**${e.key.toLocaleString()}** Messages \`(${(e.key - profile.pf.msgTotal).toLocaleString()} Messages Left)\` ↦ <@&${e.value}>`)
            .setDisabledNavigationEmojis(['delete'])
            .setPageIndicator('footer')
        return FieldsEmbed.build();
    }
}