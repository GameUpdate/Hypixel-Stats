const { MessageEmbed } = require("discord.js")
const animals = require('random-animals-api');

module.exports = {
    config: {
        name: "duck",
        desc: "Get a picture of a duck"
    },
    run: async (server, message, args) => {
        const color = server.color;

        animals.duck()
            .then(url => {
                let noperms = new MessageEmbed()
                    .setTitle(`:duck:`)
                    .setImage(url)
                    .setColor(color)
                return message.channel.send(noperms)
            })
    }
}