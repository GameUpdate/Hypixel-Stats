const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "rsearch",
        desc: "Search for a station",
        usage: [`rsearch <name>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            return message.channel.send(`Can't find a radio station with no name`)
        } else {
            client.radio.search(args.join(" ")).then(function (result) {
                const FieldsEmbed = new Pagination.FieldsEmbed();
                FieldsEmbed.embed
                    .setColor(color)
                    .setTitle(`Search results`)

                FieldsEmbed.setArray(result.body)
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setElementsPerPage(10)
                    .formatField("** **", (e) => `${e.text} ↦ \`${e.guide_id}\``)
                    .setDisabledNavigationEmojis(['delete'])
                    .setPageIndicator('footer')
                return FieldsEmbed.build();
            })
        }
    }
}