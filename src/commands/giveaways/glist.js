const { MessageEmbed } = require("discord.js")
Pagination = require("discord-paginationembed");
const moment = require('moment');

module.exports = {
    config: {
        name: "glist",
        desc: "List all the giveaways in the server",
        usage: [`glist`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let onServer = client.gaManager.giveaways.filter((g) => g.guildID === message.guild.id);
        const FieldsEmbed = new Pagination.FieldsEmbed();
        FieldsEmbed.embed
            .setColor(color)
            .setTitle(`Giveaways in ${message.guild.name}`)

        FieldsEmbed.setArray(onServer[0] ? onServer : [])
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setElementsPerPage(10)
            .formatField("** **", (e) => `${e.ended ? `<:dnd:759044009854631966>` : `<:online:759044009900376104>`} [${e.prize}](https://discord.com/channels/${e.guildID}/${e.channelID}/${e.messageID}) • \`${e.winnerCount} Winner(s)\` ↦ ${e.ended ? `Ended` : `Ending`} on: \`${moment(new Date(e.endAt)).format("DD/MM/YYYY [at] h:m a")}\``)
            .setDisabledNavigationEmojis(['delete'])
            .setPageIndicator('footer')
        return FieldsEmbed.build();
    }
}