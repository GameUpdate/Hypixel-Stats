const { MessageEmbed } = require("discord.js")
var randomApod = require('random-apod');

module.exports = {
    config: {
        name: "space",
        desc: "Get a random picture of space from the NASA database",
        usage: [`space`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let pic = JSON.stringify(randomApod(), null, '  ')
        let img = JSON.parse(pic)

        let noperms = new MessageEmbed()
            .setColor(color)
            .setTitle(':ringed_planet: Random space pic')
            .setDescription(img.title)
            .setImage(img.image)
            .setURL(img.image)
        return message.channel.send(noperms)
    }
}