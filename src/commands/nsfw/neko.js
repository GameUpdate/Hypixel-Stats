const { MessageEmbed } = require("discord.js")
const akaneko = require('akaneko');

module.exports = {
    config: {
        name: "neko",
        nsfw: true,
        desc: `Get a neko`,
        usage: [`neko`],
    },
    run: async (server, message, args) => {
        const color = server.color;

        let noperms = new MessageEmbed()
            .setColor(color)

        let img = akaneko.lewdNeko()
        noperms.setTitle(`:hot_face: Neko pic`)
        noperms.setImage(img)
        noperms.setURL(img)
        return message.channel.send(noperms)
    }
}