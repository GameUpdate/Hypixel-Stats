const { MessageEmbed } = require("discord.js")
const { lookupName } = require("namemc");
var moment = require('moment');

module.exports = {
    config: {
        name: "namemc",
        aliases: ['nmc', 'ign'],
        desc: "Get the name history of a minecraft IGN",
        usage: [`ign <ign>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) return message.channel.send("Maybe give me an ign to lookup?")
        const user = await lookupName(args[0]);
        if (!user) return message.channel.send("Couldn't find a minecraft user with that name")

        let old = user[0].pastNames.map((n, index) => `IGN: \`${n.name}\` | Changed: \`${moment(n.changedAt).fromNow()}\``).join('\n')
        let noperms = new MessageEmbed()
            .setTitle(user[0].currentName)
            .setDescription(old)
            .setThumbnail(user[0].imageUrls.head)
            .setColor(color)
        return message.channel.send(noperms)
    }
}