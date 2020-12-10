const { MessageEmbed } = require("discord.js")
const nek = require('nekos.life');
const neko = new nek();

module.exports = {
    config: {
        name: "feet",
        nsfw: true,
        desc: `Get anime feet`,
        usage: [`feet`],
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!message.channel.nsfw) { return message.channel.send("You can't use this command in a non-NSFW channel you silly goose") }

        let noperms = new MessageEmbed()
            .setColor(color)
            .setDescription(`${message.member} likes feet yikes`)

        let feet = await neko.nsfw.eroFeet()
        noperms.setImage(feet.url)
        return message.channel.send(noperms)
    }
}