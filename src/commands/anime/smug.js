const { MessageEmbed } = require("discord.js")
const nek = require('nekos.life');
const neko = new nek();

module.exports = {
    config: {
        name: "smug",
        desc: "Get a smug gif",
        usage: [`smug`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let noperms = new MessageEmbed()
            .setColor(color)
            .setDescription(`${message.member} feels pretty smug rn`)

        let smug = await neko.sfw.smug()
        noperms.setImage(smug.url)
        return message.channel.send(noperms)
    }
}